import { Parameter } from '@/types/Parameter';
import * as BaseApi from './baseAPI.service';

/**
 * 
 * @param id 
 * @param token 
 * @param data 
 * @returns 
 */
const updateParameter = async (id: number, token: string, data: Parameter): Promise<boolean> => {
    const url: string = `parameters/${id}`;

    const response: Response = await BaseApi.putFetch(url, JSON.stringify(data), token);

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
 * @returns 
 */
const createParameter = async (token: string, data: Parameter): Promise<boolean> => {
    const url: string = `parameters`;

    const response: Response = await BaseApi.postFetch(url, JSON.stringify(data), token);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.ok;
};

/**
 *
 * @param token token
 * @returns all parameters
 */
const getParameters = async (token: string): Promise<Parameter[]> => {
    const url: string = 'parameters';

    const response: Response = await BaseApi.getFetch(url, token);
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
 * @returns parameter
 */
const getParameter = async (id: number, token: string): Promise<Parameter> => {
    const url: string = `parameters/${id}`;

    const response: Response = await BaseApi.getFetch(url, token);
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
 * @returns 
 */
const deleteParameter = async (id: number, token: string): Promise<boolean> => {
    const url: string = `parameters/${id}`;

    const response: Response = await BaseApi.deleteFetch(url, token);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.ok;
};

export { updateParameter, getParameters, getParameter, createParameter, deleteParameter };
