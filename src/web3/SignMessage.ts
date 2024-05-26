import { SessionTypes } from "@walletconnect/types";
import {
    cryptoWaitReady,
    decodeAddress,
    signatureVerify,
} from "@polkadot/util-crypto";
import { u8aToHex } from "@polkadot/util";
import { authenticate } from "../services/user.service";
import Client from "@walletconnect/sign-client";

const TERNOA_CHAIN = import.meta.env.VITE_CHAIN_PROVIDER;

export default function SignMessage (client: Client | undefined, session: SessionTypes.Struct | undefined, address: string | undefined) {
    const isValidSignaturePolkadot = (signedMessage: string, signature: string, address: string) => {
        const publicKey = decodeAddress(address);
        const hexPublicKey = u8aToHex(publicKey);

        console.log(signatureVerify(signedMessage, signature, hexPublicKey));

        return signatureVerify(signedMessage, signature, hexPublicKey).isValid;
    };

    const sign = async () => {
        if (typeof client === "undefined") {
            throw new Error("WalletConnect is not initialized");
        }
        if (typeof address === "undefined") {
            throw new Error("Not connected");
        }
        if (typeof session === "undefined") {
            throw new Error("Session not connected");
        }
        //   setIsLoading(true);
        
        // This could be any message, but will be rejected by the Wallet if it is a transaction hash
        const message = "Confirm your registration to join our community #WeAreSwissborg";
        
        try {
            const response = await client.request<string>({
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
            localStorage.setItem('accountCertified', JSON.stringify(isValid));
            const auth = await authenticate();
            localStorage.setItem('token', auth.token);
        } catch {
            console.log("ERROR: invalid signature");
        } finally {
            // setIsLoading(false);
        }
    };
  
    return sign();
}
