import { Session } from '@/types/Session';
import * as BaseApi from './baseAPI.service';

/**
 * Get all Sessions
 * @param token
 * @returns
 */
const getAllSessions = async (token: string) => {
    const url: string = 'sessions';

    const response: Response = await BaseApi.getFetch(url, token);
    const json = await response.json();
    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

/**
 *
 * @param token
 * @returns
 */
const getSession = async (id: number, token: string): Promise<Session> => {
    const url: string = `sessions/${id}`;
    const response: Response = await BaseApi.getFetch(url, token);
    const json = await response.json();
    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

/**
 * Create a new Session
 * @param token
 * @param data
 * @returns
 */
const create = async (token: string, data: Session) => {
    const url: string = 'sessions';

    const response: Response = await BaseApi.postFetch(url, JSON.stringify(data), token);
    const json = await response.json();
    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

/**
 * Update a Session
 * @param token
 * @param data
 * @returns
 */
const update = async (id: number, token: string, data: Session) => {
    const url: string = `sessions/${id}`;

    const response: Response = await BaseApi.putFetch(url, JSON.stringify(data), token);
    const json = await response.json();
    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

/**
 * Delete Session
 * @param id
 * @param token
 * @returns
 */
const destroy = async (id: number, token: string): Promise<boolean> => {
    const url: string = `sessions/${id}`;

    const response: Response = await BaseApi.deleteFetch(url, token);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.ok;
};

export { getSession, getAllSessions, create, update, destroy };
