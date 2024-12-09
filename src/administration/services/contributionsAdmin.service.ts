import { Contribution } from '@/types/contribution';
import * as BaseApi from './baseAPI.service';

/**
 * Retrieve all contributions
 * @param token token
 * @returns all contributions
 */
const getContributions = async (token: string): Promise<Contribution[]> => {
    const url: string = `contributions`;

    const response: Response = await BaseApi.getFetch(url, token);
    const json = await response.json();

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

/**
 * Retrieve contribution by identifiant
 * @param token token
 * @returns contribution
 */
const getContribution = async (id: number, token: string): Promise<Contribution> => {
    const url: string = `contributions/${id}`;

    const response: Response = await BaseApi.getFetch(url, token);
    const json = await response.json();

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

/**
 * Create a contribution
 * @param token token
 * @returns contribution
 */
const createContribution = async (data: Contribution, token: string): Promise<Contribution> => {
    const url: string = `contributions`;

    const response: Response = await BaseApi.postFetch(url, JSON.stringify(data), token);
    const json = await response.json();

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

/**
 * Create a contribution
 * @param token token
 * @returns contribution
 */
const updateContribution = async (id: number, data: Contribution, token: string): Promise<Contribution> => {
    const url: string = `contributions/${id}`;

    const response: Response = await BaseApi.putFetch(url, JSON.stringify(data), token);
    const json = await response.json();

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

export { getContribution, getContributions, createContribution, updateContribution };
