import { Parameter } from '@/types/Parameter';
import * as BaseApi from './baseAPI.service';

/**
 *
 * @param id
 * @param token
 * @param data
 * @param setToken
 * @returns
 */
const updateParameter = async (id: number, token: string, data: Parameter, setToken: (newToken: string) => void): Promise<boolean> => {
    const url: string = `parameters/${id}`;

    const response: Response = await BaseApi.putFetch(url, JSON.stringify(data), token, setToken);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.ok;
};

/**
 *
 * @param token
 * @param data
 * @param setToken
 * @returns
 */
const createParameter = async (token: string, data: Parameter, setToken: (newToken: string) => void): Promise<boolean> => {
    const url: string = `parameters`;

    const response: Response = await BaseApi.postFetch(url, JSON.stringify(data), token, setToken);

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
 * @returns all parameters
 */
const getParameters = async (token: string, setToken: (newToken: string) => void): Promise<Parameter[]> => {
    const url: string = 'parameters';

    const response: Response = await BaseApi.getFetch(url, token, setToken);
    const json = await response.json();

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

/**
 *
 * @param token token
 * @param setToken
 * @returns parameter
 */
const getParameter = async (id: number, token: string, setToken: (newToken: string) => void): Promise<Parameter> => {
    const url: string = `parameters/${id}`;

    const response: Response = await BaseApi.getFetch(url, token, setToken);
    const json = await response.json();

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

/**
 *
 * @param id
 * @param token
 * @param setToken
 * @returns
 */
const deleteParameter = async (id: number, token: string, setToken: (newToken: string) => void): Promise<boolean> => {
    const url: string = `parameters/${id}`;

    const response: Response = await BaseApi.deleteFetch(url, token, setToken);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.ok;
};

export { updateParameter, getParameters, getParameter, createParameter, deleteParameter };
