import { Contribution } from '@/types/contribution';
import * as BaseApi from './baseAPI.services';

const getContributions = async (token: string): Promise<Contribution[]> => {
    const url: string = `contributions`;
    const response: Response = await BaseApi.getFetch(url, token);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.json();
};

export { getContributions };