import { FC, ReactNode, useCallback, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { Adapter, WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import type { SolanaSignInInput } from '@solana/wallet-standard-features';
import { verifySignIn } from '@solana/wallet-standard-util';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';
import { useAutoConnect } from './AutoConnectProvider';
import { toast } from 'react-toastify';
import { getNonce, authenticate } from '@/services/auth.services';

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Mainnet;
    const { autoConnect } = useAutoConnect();

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
        ],
        [network],
    );

    const onError = useCallback((error: WalletError, adapter?: Adapter) => {
        toast.error(error.message ? `${error.name}: ${error.message}` : error.name);
        console.error(error, adapter);
    }, []);

    const autoSignIn = useCallback(async (adapter: Adapter) => {
        if (!('signIn' in adapter)) return true;

        const nonce = await getNonce();

        const input: SolanaSignInInput = {
            domain: window.location.host,
            address: adapter.publicKey ? adapter.publicKey.toBase58() : undefined,
            statement: 'Please sign in.',
            nonce: nonce.nonce
        };
        const output = await adapter.signIn(input);

        if (!verifySignIn(input, output)) throw new Error('Sign In verification failed!');

        console.log('output', output.account);
        await authenticate({ output: output, nonce: nonce.nonce });

        return false;
    }, []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} onError={onError} autoConnect={autoConnect && autoSignIn}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
