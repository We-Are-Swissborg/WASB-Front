import { User } from '@/types/User';
import * as BaseApi from './baseAPI.service';

/**
 *
 * @param id
 * @param token
 * @param setToken
 * @returns
 */
const getUserWithAllInfo = async (id: number, token: string, setToken: (newToken: string) => void): Promise<User> => {
    const url: string = `users/${id}`;

    const response: Response = await BaseApi.getFetch(url, token, setToken);
    const json = await response.json();

    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

/**
 *
 * @param id
 * @param token
 * @param setToken
 * @param data
 * @returns
 */
const updateUser = async (id: number, token: string, data: User, setToken: (newToken: string) => void): Promise<boolean> => {
    const url: string = `users/${id}`;

    const response: Response = await BaseApi.putFetch(url, JSON.stringify(data), token, setToken);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.ok;
};

/**
 *
 * @param token token
 * @param setToken
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

export { getUserWithAllInfo, updateUser, getUsers };
