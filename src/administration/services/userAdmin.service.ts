import { User } from '@/types/User';
import * as BaseApi from './baseAPI.service';

/**
 *
 * @param id
 * @param token
 * @returns
 */
const getUserWithAllInfo = async (id: number, token: string): Promise<User> => {
    const url: string = `users/${id}`;

    const response: Response = await BaseApi.getFetch(url, token);
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
 * @param data
 * @returns
 */
const updateUser = async (id: number, token: string, data: User): Promise<boolean> => {
    const url: string = `users/${id}`;

    const response: Response = await BaseApi.putFetch(url, JSON.stringify(data), token);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.ok;
};

/**
 *
 * @param token token
 * @returns all users
 */
const getUsers = async (token: string): Promise<User[]> => {
    const url: string = 'users';

    const response: Response = await BaseApi.getFetch(url, token);
    const json = await response.json();

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

export { getUserWithAllInfo, updateUser, getUsers };
