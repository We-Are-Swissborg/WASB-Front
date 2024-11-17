import { AddContribution, Membership } from '@/types/Membership';
import * as BaseApi from './baseAPI.services';

const addContribution = async (contribution: AddContribution, token: string): Promise<Membership> => {
    const url: string = `memberships`;
    const response: Response = await BaseApi.postFetch(url, JSON.stringify(contribution), token);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.json();
};

const getMemberships = async (token: string): Promise<Membership[]> => {
    const url: string = `memberships/me`;
    const response: Response = await BaseApi.getFetch(url, token);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.json();
};

export { addContribution, getMemberships };
