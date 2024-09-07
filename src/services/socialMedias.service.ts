import { SocialMedias } from '../types/SocialMedias';
import * as BaseApi from './baseAPI.services';

const updateSocialMediasUser = async (userId: number, token: string, data: SocialMedias): Promise<boolean> => {
    const url: string = `users/${userId}/socialMedias`;

    const response: Response = await BaseApi.patchFetch(url, JSON.stringify(data), token);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.ok;
};

export { updateSocialMediasUser };
