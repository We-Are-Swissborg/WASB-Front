import { Nonce } from '../types/Security';
import { postFetch } from './baseAPI.services';

/**
 * Generates a random value for the wallet
 * @param walletAddress wallet address
 * @returns
 */
const generateNonce = async (walletAddress: string): Promise<Nonce> => {
    const url: string = 'users/nonce';
    const data = {
        walletAddress: walletAddress,
    };

    const response: Response = await postFetch(url, JSON.stringify(data));

    if (!response.ok) {
        throw new Error('An error has occurred: ' + response.statusText);
    }

    return await response.json();
};

/**
 * authenticate with wallet and signed message
 * @param walletAddress wallet address
 * @param signedHash signed message hash
 * @returns
 */
const authenticate = async (walletAddress: string, signedHash: string): Promise<string> => {
    const url: string = 'authWallet';
    const data = { walletAddress: walletAddress, signedMessageHash: signedHash };

    const response: Response = await postFetch(url, JSON.stringify(data));
    const json = await response.json();

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

/**
 * Send forget password email.
 * @param email your email
 * @param lang language
 */
const passwordForget = async (email: string, lang: string): Promise<boolean> => {
    const url = `passwordForget/${lang}`;
    const data = { email: email };

    const response: Response = await postFetch(url, JSON.stringify(data));

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.ok;
};

/**
 * set a new password for an user
 * @param newPassword new password
 */
const resetPassword = async (newPassword: string, slug: string): Promise<boolean> => {
    const url = `resetPassword/`+ slug;
    const data = { newPassword };

    const response: Response = await postFetch(url, JSON.stringify(data));

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.ok;
};

export {
    generateNonce,
    auth,
    authenticate,
    passwordForget,
    resetPassword
};
