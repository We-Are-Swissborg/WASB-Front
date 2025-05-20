import { Contribution } from '@/types/contribution';
import * as BaseApi from './baseAPI.services';

const getContributions = async (token: string, setToken: (newToken: string) => void): Promise<Contribution[]> => {
    const url: string = `contributions`;
    const response: Response = await BaseApi.getFetch(url, token, setToken);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.json();
};

export { getContributions };
