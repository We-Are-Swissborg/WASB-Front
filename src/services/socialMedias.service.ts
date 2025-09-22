import { SocialMedias } from '../types/SocialMedias';
import * as BaseApi from './baseAPI.services';

const updateSocialMediasUser = async (userId: number, token: string, data: SocialMedias, setToken: (newToken: string) => void): Promise<boolean> => {
    const url: string = `users/${userId}/socialMedias`;

    const response: Response = await BaseApi.patchFetch(url, JSON.stringify(data), token, setToken);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.ok;
};

export { updateSocialMediasUser };
