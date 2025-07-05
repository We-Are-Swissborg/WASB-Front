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

const create = async (token: string, data: Session, setToken: (newToken: string) => void) => {
    const url: string = 'sessions';

    const response: Response = await BaseApi.postFetch(url, JSON.stringify(data), token, setToken);
    const json = await response.json();

    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

const update = async (id: number, token: string, data: Session, setToken: (newToken: string) => void) => {
    const url: string = `sessions/${id}`;

    const response: Response = await BaseApi.putFetch(url, JSON.stringify(data), token, setToken);
    const json = await response.json();
    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

const getSession = async (id: number, token: string, setToken: (newToken: string) => void): Promise<Session> => {
    const url: string = `sessions/${id}`;
    const response: Response = await BaseApi.getFetch(url, token, setToken);
    const json = await response.json();
    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

const getMySessions = async (url: string, token: string, setToken: (newToken: string) => void): Promise<PaginatedSessionsResponse> => {
    const response: Response = await BaseApi.getFetch(url, token, setToken);
    const json = await response.json();
    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};


export { getAllSessions, getSessionBySlug, create, update, getSession, getMySessions };
