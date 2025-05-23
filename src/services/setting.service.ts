import { Parameter } from '@/types/Parameter';
import * as BaseApi from './baseAPI.services';

const getParametersByCode = async (code: string, token: string, setToken: (newToken: string) => void): Promise<Parameter[]> => {
    console.log('getParametersByCode', code);
    const url: string = `parameters/${code}`;

    const response: Response = await BaseApi.getFetch(url, token, setToken);
    const json = await response.json();

    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

export { getParametersByCode };
