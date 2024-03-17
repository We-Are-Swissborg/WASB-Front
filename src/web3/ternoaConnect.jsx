import { useCallback, useState, useEffect } from "react";
import Client from "@walletconnect/sign-client";
import QRCodeModal from "@walletconnect/legacy-modal";
import { ERROR } from "@walletconnect/utils";
import {
  cryptoWaitReady,
  decodeAddress,
  signatureVerify,
} from "@polkadot/util-crypto";
import { u8aToHex } from "@polkadot/util";

const DEFAULT_APP_METADATA = {
  name: "WeAreSwissborg",
  description: "The association that supports you in your crypto adventure!",
  url: "https://weareswissborg.com",
  icons: ["https://weareswissborg.com/favicon.ico"],
};

const TERNOA_CHAIN = import.meta.env.VITE_CHAIN_PROVIDER;
const RELAY_URL = "wss://wallet-connectrelay.ternoa.network/";
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID; // Get your project id by applying to the form, link in the introduction
const requiredNamespaces = {
  ternoa: {
      chains: [TERNOA_CHAIN],
      events: ["event_test"], // events that we will use, each project implements events according to the business logic
      methods: ["sign_message"], // methods that we will use, each project implements methods according to the business logic
  },
};

console.log();


export default function TernoaConnect() {
    const reset = () => {
      setPairings([]);
      setSession(null);
      localStorage.removeItem("walletTernoa");
      setAddress(null);
      localStorage.removeItem("sessionTernoa");
    };

    const [client, setClient] = useState(null);
    const [pairings, setPairings] = useState(null);
    const [session, setSession] = useState(null);
    const [address, setAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [isAccountCertified, setIsAccountCertified] = useState(false);
    const [addressSplited, setAddressSplited] = useState();


    const onSessionConnected = useCallback((_session) => {
      const _pubKey = Object.values(_session.namespaces)
        .map((namespace) => namespace.accounts)
        .flat()[0]
        .split(":")[2];
      setSession(_session);
      setAddress(_pubKey);
      setAddressSplited(generatePartialString(_pubKey,0,4));
      localStorage.setItem("walletTernoa", _pubKey);
      localStorage.setItem("sessionTernoa", JSON.stringify(_session));
    }, []);

    const connect = useCallback(
      async (pairing) => {
        if (typeof client === "undefined") {
          console.log("WalletConnect is not initialized");
          throw new Error("WalletConnect is not initialized");
        }
        try {
          const { uri, approval } = await client.connect({
            pairingTopic: pairing?.topic,
            requiredNamespaces: requiredNamespaces,
          });
          if (uri) {
            console.log('uri', uri);
            QRCodeModal.open(uri, () => {});
          }
          // Here we will await the Wallet's response to the pairing proposal
          const session = await approval();
          onSessionConnected(session);
          console.log("session", session);
          return session;
        } catch (e) {
          console.error(e);
          return null;
        } finally {
          QRCodeModal.close();
        }
      },
      [client, onSessionConnected]
    );

    const subscribeToEvents = useCallback(
      async (_client) => {
        if (typeof _client === "undefined") {
          throw new Error("WalletConnect is not initialized");
        }
        // here we can use several type of events, predefined in the Wallect Connect document
        _client.on("session_update", ({ topic, params }) => {
          const { namespaces } = params;
          const _session = _client.session.get(topic);
          const updatedSession = { ..._session, namespaces };
          onSessionConnected(updatedSession);
        });
        _client.on("session_delete", () => {
          // Session was deleted -> reset the dapp state, clean up from user session, etc.
          reset();
        });
      },
      [onSessionConnected]
    );

    function generatePartialString(inputString, start, end) {
      const length = inputString.length;
      let retVal = inputString.substring(start, end);
      retVal += `...${inputString.substring(length - 4, length)}`;
      return retVal;
    }

    const checkPersistedState = useCallback(
      async (_client) => {
        if (typeof _client === "undefined") {
          throw new Error("WalletConnect is not initialized");
        }
        setPairings(_client.pairing.values);

        if (typeof session !== "undefined") return;

        if (_client.session.length) {
          const lastKeyIndex = _client.session.keys.length - 1;
          const _session = _client.session.get(
            _client.session.keys[lastKeyIndex]
          );
          await onSessionConnected(_session);
          return _session;
        }
      },
      [session, onSessionConnected]
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
          console.error(err)
          throw err;
        } finally {
          setIsInitializing(false);
        }
      }, [subscribeToEvents, checkPersistedState]);

    const disconnect = useCallback(async () => {
      if (typeof client === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }
      if (typeof session === "undefined") {
        throw new Error("Session is not connected");
      }
      await client.disconnect({
        topic: session.topic,
        reason: ERROR.USER_DISCONNECTED.format(),
      });

      reset();
    }, [client, session]);

    const signMessage = useCallback(async () => {
      if (typeof client === "undefined") {
          throw new Error("WalletConnect is not initialized");
      }
      if (typeof address === "undefined") {
        throw new Error("Not connected");
      }
      if (typeof session === "undefined") {
        throw new Error("Session not connected");
      }
      setIsLoading(true);

      // This could be any message, but will be rejected by the Wallet if it is a transaction hash
      const message = "Confirm your registration to join our community #WeAreSwissborg";

      try
      {
        const response = await client.request({
          chainId: TERNOA_CHAIN,
          topic: session.topic,
          request: {
            method: "sign_message",
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
        const isValid = isValidSignaturePolkadot(
          message,
          responseObj.signedMessageHash,
          address
        );
        setIsAccountCertified(isValid);
      } catch {
        console.log("ERROR: invalid signature");
      } finally {
        setIsLoading(false);
      }
    }, [client, session, address]);

    // if the "client" doesn't exist yet, we call "createClient"
    useEffect(() => {
      if (!client) {
        createClient();
        if(localStorage.getItem("walletTernoa")) {
          const _session = JSON.parse(localStorage.getItem("sessionTernoa") || "");
          setSession(_session);
          setAddress(localStorage.getItem("walletTernoa") || "");
          setAddressSplited(generatePartialString(localStorage.getItem("walletTernoa") || "",0,4));
        }
      }
  }, [client, createClient]);

    const isValidSignaturePolkadot = (signedMessage, signature, address) => {
      const publicKey = decodeAddress(address);
      const hexPublicKey = u8aToHex(publicKey);
      return signatureVerify(signedMessage, signature, hexPublicKey).isValid;
    };

  if(!isInitializing && !address) {
    return (
      <>
          <button className="btn btn-secondary" onClick={connect}>Login</button>
      </>
    );
  } else {
    return (
      <>
        <div className="dropdown">
        <button type="button" className="btn btn-outline-secondary" id="navbarConnection" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          {addressSplited}
        </button>
          <ul className="dropdown-menu dropdown-menu-md-end" aria-labelledby="navbarConnection">
            <li>Account certified: {isAccountCertified + ""}</li>
            <li><button className="dropdown-item" onClick={signMessage}><i className="fas fa-signature"></i> Test sign</button></li>
            <li><button className="dropdown-item" onClick={disconnect}><i className="fas fa-right-from-bracket"></i> Logout</button></li>
          </ul>
        </div>
      </>
    );
  }
}