
import { Nonce } from '../types/Security';
import { postFetch } from './baseAPI.services';

const generateNonce = async (walletAddress: string): Promise<Nonce> => {
    const url: string = 'users/nonce';
    const data = {
        walletAddress: walletAddress
    };

    const response: Response = await postFetch(url, JSON.stringify(data));

    if (!response.ok) {
        throw new Error('An error has occurred: ' + response.statusText);
    }

    return await response.json();
};

const authenticate = async (walletAddress: string, signedHash: string): Promise<string> => {
    const url: string = 'users/auth';
    const data = {walletAddress: walletAddress, signedMessageHash:signedHash};

    const response: Response = await postFetch(url, JSON.stringify(data));

    if (!response.ok) {
        throw new Error('An error has occurred: ' + response.statusText);
    }

    return await response.json();
};

export { generateNonce, authenticate };
