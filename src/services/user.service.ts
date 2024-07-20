import Registration from '../types/Registration';
import * as BaseApi from './baseAPI.services';

const register = async (data: Registration) => {
    const url: string = 'users/register';

    const response: Response = await BaseApi.postFetch(url, JSON.stringify(data));
    const json = await response.json();

    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

const checkReferralExist = async (codeRef: string) => {
    const url: string = 'users/codeRef/' + codeRef;

    const response: Response = await BaseApi.getFetch(url);
    const json = await response.json();

    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

export { register, checkReferralExist };
