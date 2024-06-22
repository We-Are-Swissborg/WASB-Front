import { Registration } from './../types/Registration';
import { postFetch } from './baseAPI.services';

const register = async (data: Registration) => {
    const url: string = 'users/register';

    const response: Response = await postFetch(url, JSON.stringify(data));

    if (!response.ok) {
        throw new Error('An error has occurred: ' + response.statusText);
    }

    return await response.json();
};

export { register };