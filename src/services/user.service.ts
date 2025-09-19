import Registration from '../types/Registration';
import { User } from '../types/User';
import * as BaseApi from './baseAPI.services';

const register = async (data: Registration) => {
    const url: string = 'register';

    const response: Response = await BaseApi.postFetch(url, JSON.stringify(data));
    const json = await response.json();

    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

const checkReferralExist = async (codeRef: string): Promise<string> => {
    const url: string = 'users/codeRef/' + codeRef;

    const response: Response = await BaseApi.getFetch(url);
    const json = await response.json();

    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

const getUserWithAllInfo = async (id: number, token: string, setToken: (newToken: string) => void): Promise<User> => {
    const url: string = 'users/allInfo/' + id;

    const response: Response = await BaseApi.getFetch(url, token, setToken);
    const json = await response.json();

    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

const patchUser = async (id: number, token: string, data: Partial<User>, setToken: (newToken: string) => void): Promise<boolean> => {
    const url: string = 'users/' + id;

    const response: Response = await BaseApi.patchFetch(url, JSON.stringify(data), token, setToken);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.ok;
};

/**
 *
 * @param token token
 * @param setToken set token 
 * @returns all users
 */
const getUsers = async (token: string, setToken: (newToken: string) => void): Promise<User[]> => {
    const url: string = 'users';

    const response: Response = await BaseApi.getFetch(url, token, setToken);
    const json = await response.json();

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

/**
 * Retrive username all organizer
 * @param token token
 * @param setToken set token 
 * @returns username organizers
 */
const getUsernameOrganizers = async (token: string, setToken: (newToken: string) => void): Promise<User[]> => {
    const url: string = 'users/organizers/username';

    const response: Response = await BaseApi.getFetch(url, token, setToken);
    const json = await response.json();

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

export {
    register,
    checkReferralExist,
    getUserWithAllInfo,
    getUsers,
    patchUser,
    getUsernameOrganizers
};
