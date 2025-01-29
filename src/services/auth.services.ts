import { Nonce } from '../types/Security';
import { getFetch, postFetch } from './baseAPI.services';
import type { SolanaSignInOutput } from '@solana/wallet-standard-features';

/**
 * Call a random nonce
 * @returns
 */
const getNonce = async (): Promise<Nonce> => {
    const url: string = 'getNonce';

    const response: Response = await getFetch(url);

    if (!response.ok) {
        throw new Error('An error has occurred: ' + response.statusText);
    }

    return await response.json();
};

/**
 * authenticate with wallet and signed message
 * @param publicKey wallet address
 * @param signedMessage signed message hash
 * @returns
 */
const authenticate = async ({
    nonce,
    output,
}: {
    nonce: string;
    output: SolanaSignInOutput;
}): Promise<string> => {

    const url: string = 'authWallet';
    const data = { output, nonce };

    console.log('data', data);

    const response: Response = await postFetch(url, JSON.stringify(data));
    const json = await response.json();
    console.log('response', json);

    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json.token;
};

/**
 * authenticate with credential username and password
 * @param username your username
 * @param password your password
 */
const auth = async (username: string, password: string): Promise<string> => {
    const url = `auth`;
    const data = { username: username, password: password };

    const response: Response = await postFetch(url, JSON.stringify(data));
    const json = await response.json();

    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json.token;
};

export { auth, authenticate, getNonce };
