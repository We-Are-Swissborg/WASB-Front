import { PaginatedSessionsResponse, Session } from '@/types/Session';
import * as BaseApi from './baseAPI.services';

const getAllSessions = async (url: string): Promise<PaginatedSessionsResponse> => {
    const response: Response = await BaseApi.getFetch(url);
    const json = await response.json();
    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

const getSessionBySlug = async (url: string): Promise<Session> => {
    const response: Response = await BaseApi.getFetch(url);
    const json = await response.json();
    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

export { getAllSessions, getSessionBySlug };
