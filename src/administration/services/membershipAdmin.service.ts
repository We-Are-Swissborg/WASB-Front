import { AddContribution, Membership } from '@/types/Membership';
import * as BaseApi from './baseAPI.service';

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
    const url: string = `memberships`;
    const response: Response = await BaseApi.getFetch(url, token);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.json();
};

const getMembership = async (id: number, token: string): Promise<Membership> => {
    const url: string = `memberships/${id}`;
    const response: Response = await BaseApi.getFetch(url, token);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.json();
};

const changeStatusMembership = async (id: number, data: Membership, token: string): Promise<Membership> => {
    const url: string = `memberships/${id}`;
    const response: Response = await BaseApi.patchFetch(url, JSON.stringify(data), token);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.json();
};

export { addContribution, getMemberships, getMembership, changeStatusMembership };
