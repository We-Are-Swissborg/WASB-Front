import { useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';

import Client from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';
import QRCodeModal from '@walletconnect/legacy-modal';
import { ERROR } from '@walletconnect/utils';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import wasb_favicon from '../assets/images/svg/wasb_favicon.svg';
import iconWalletconnect from '../assets/images/svg/walletconnect_icon.svg';
import { authenticate, generateNonce } from '../services/auth.services';
import { Nonce } from '../types/Security';
import { useLoading } from '../contexts/LoadingContext';
import { toast } from 'react-toastify';

const DEFAULT_APP_METADATA = {
    name: import.meta.env.DEV ? 'We Are Swissborg (DEV)' : 'We Are Swissborg',
    description: 'The association that supports you in your crypto adventure!',
    url: window.location.origin,
    icons: [`${window.location.origin}/${wasb_favicon}`],
};

const TERNOA_CHAIN = import.meta.env.VITE_CHAIN_PROVIDER || '';
const RELAY_URL = 'wss://wallet-connectrelay.ternoa.network/';
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID; // Get your project id by applying to the form, link in the introduction
const requiredNamespaces = {
    ternoa: {
        chains: [TERNOA_CHAIN],
        events: ['event_test'], // events that we will use, each project implements events according to the business logic
        methods: ['sign_message'], // methods that we will use, each project implements methods according to the business logic
    },
};

if (!PROJECT_ID) {
    throw new Error('You need to provide PROJECT_ID env variable');
}

export default function TernoaConnect() {
    const { t } = useTranslation('global');
    const navigate = useNavigate();

    const reset = () => {
        //   setPairings([]);
        setSession(undefined);
        setAddress(undefined);
        localStorage.removeItem('walletTernoa');
        localStorage.removeItem('sessionTernoa');
        localStorage.removeItem('token');
    };

    const [client, setClient] = useState<Client>();
    // const [pairings, setPairings] = useState<PairingTypes.Struct[]>([]);
    const [session, setSession] = useState<SessionTypes.Struct>();
    const [address, setAddress] = useState<string>();
    const [addressSplited, setAddressSplited] = useState<string>();
    const [nonce, setNonce] = useState<Nonce>();
    const { setIsLoading } = useLoading();
    const [isInitializing, setIsInitializing] = useState<boolean>(false);

    function getAddressFromSession(_session: SessionTypes.Struct): string {
        return Object.values(_session.namespaces)
            .map((namespace) => namespace.accounts)
            .flat()[0]
            .split(':')[2];
    }

    const onSessionConnected = useCallback((_session: SessionTypes.Struct) => {
        const address = getAddressFromSession(_session);
        setSession(_session);
        setAddress(address);
        setAddressSplited(generatePartialString(address, 0, 4));
    }, []);

    const signMessage = useCallback(async () => {
        if (typeof client === 'undefined') {
            throw new Error('WalletConnect is not initialized');
        }
        if (typeof address === 'undefined') {
            throw new Error('Not connected');
        }
        if (typeof session === 'undefined') {
            throw new Error('Session not connected');
        }
        if (typeof nonce === 'undefined') {
            throw new Error('Nonce not initialized');
        }

        // This could be any message, but will be rejected by the Wallet if it is a transaction hash
        const message = `Confirm your authentication to our community #WeAreSwissborg \nNONCE : ${nonce.nonce}`;

        try {
            setIsLoading(true);

            const response = await client.request<string>({
                chainId: TERNOA_CHAIN,
                topic: session.topic,
                request: {
                    method: 'sign_message',
                    params: {
                        pubKey: address,
                        request: {
                            message,
                        },
                    },
                },
            });

            const responseObj = JSON.parse(response);

            await cryptoWaitReady();
            await authenticate(address, responseObj.signedMessageHash);
            localStorage.setItem('walletTernoa', address);
            localStorage.setItem('sessionTernoa', JSON.stringify(session));
            toast.success(t('authenticate.welcome'));
        } catch (e) {
            console.log('ERROR: invalid signature', e);
            toast.error(t('authenticate.error-sign'));
            disconnect();
        } finally {
            setIsLoading(false);
        }
    }, [client, session, address, nonce]);

    const connect = useCallback(async () => {
        if (typeof client === 'undefined') {
            throw new Error('WalletConnect is not initialized');
        }
        try {
            const { uri, approval } = await client.connect({
                requiredNamespaces: requiredNamespaces,
            });
            if (uri) {
                QRCodeModal.open(uri, () => {});
            }
            // Here we will await the Wallet's response to the pairing proposal
            const session = await approval();
            onSessionConnected(session);
            const address = getAddressFromSession(session);
            const nonce = await generateNonce(address);
            setNonce(nonce);
            return session;
        } catch (e) {
            console.error(e);
            return null;
        } finally {
            QRCodeModal.close();
        }
    }, [client, onSessionConnected]);

    const subscribeToEvents = useCallback(
        async (_client: Client) => {
            if (typeof _client === 'undefined') {
                throw new Error('WalletConnect is not initialized');
            }
            // here we can use several type of events, predefined in the Wallet Connect document
            _client.on('session_update', ({ topic, params }) => {
                const { namespaces } = params;
                const _session = _client.session.get(topic);
                const updatedSession = { ..._session, namespaces };
                onSessionConnected(updatedSession);
            });
            _client.on('session_delete', () => {
                // Session was deleted -> reset the dapp state, clean up from user session, etc.
                reset();
            });
        },
        [onSessionConnected],
    );

    function generatePartialString(inputString: string, start: number, end: number) {
        const length = inputString.length;
        let retVal = inputString.substring(start, end);
        retVal += `...${inputString.substring(length - 4, length)}`;
        return retVal;
    }

    const checkPersistedState = useCallback(
        async (_client: Client) => {
            if (typeof _client === 'undefined') {
                throw new Error('WalletConnect is not initialized');
            }
            // setPairings(_client.pairing.values);

            if (typeof session !== 'undefined') return;

            if (_client.session.length) {
                const lastKeyIndex = _client.session.keys.length - 1;
                const _session = _client.session.get(_client.session.keys[lastKeyIndex]);
                await onSessionConnected(_session);
                return _session;
            }
        },
        [session, onSessionConnected],
    );

    const createClient = useCallback(async () => {
        try {
            setIsInitializing(true);
            const _client = await Client.init({
                relayUrl: RELAY_URL,
                projectId: PROJECT_ID,
                metadata: DEFAULT_APP_METADATA,
            });
            // Here we subscribe to the events
            await subscribeToEvents(_client);

            // Here we check if we have any persisted session
            await checkPersistedState(_client);

            setClient(_client);
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setIsInitializing(false);
        }
    }, [subscribeToEvents, checkPersistedState]);

    const disconnect = useCallback(async () => {
        if (typeof client === 'undefined') {
            throw new Error('WalletConnect is not initialized');
        }
        if (typeof session === 'undefined') {
            throw new Error('Session is not connected');
        }
        await client.disconnect({
            topic: session.topic,
            reason: ERROR.USER_DISCONNECTED.format(),
        });

        reset();
        navigate('/', { replace: true });
    }, [client, session, navigate]);

    useEffect(() => {
        if (nonce) {
            signMessage();
        }
    }, [nonce, signMessage]);

    // if the "client" doesn't exist yet, we call "createClient"
    useEffect(() => {
        if (!client) {
            createClient();
            if (localStorage.getItem('walletTernoa')) {
                const _session = JSON.parse(localStorage.getItem('sessionTernoa') || '');
                setSession(_session);
                setAddressSplited(generatePartialString(localStorage.getItem('walletTernoa') || '', 0, 4));
            }
        }
    }, [client]);

    if (isInitializing) {
        return (
            <div className="bg-gradient gradient-div">
                <button className="btn bg-white radius-button">
                    {' '}
                    <img className="me-2" src={iconWalletconnect} />
                    <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </button>
            </div>
        );
    } else if (!address) {
        return (
            <div className="bg-gradient gradient-div">
                <button className="btn bg-white radius-button" onClick={connect}>
                    {' '}
                    <img className="me-2" src={iconWalletconnect} />
                    WalletConnect
                </button>
            </div>
        );
    } else {
        return (
            <>
                <div className="dropdown bg-gradient gradient-div">
                    <button
                        type="button"
                        className="btn bg-white radius-button"
                        id="navbarConnection"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        {addressSplited}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-md-end" aria-labelledby="navbarConnection">
                        <li>
                            <NavLink className="dropdown-item" to="/register">
                                {t('nav.register')}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className="dropdown-item" to="/setting">
                                {t('nav.profile')}
                            </NavLink>
                        </li>
                        <li>
                            <button className="dropdown-item" onClick={disconnect}>
                                <i className="fas fa-right-from-bracket"></i>
                                {t('ternoa.logout')}
                            </button>
                        </li>
                    </ul>
                </div>
            </>
        );
    }
}
