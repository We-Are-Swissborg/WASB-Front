import { SocialMedias } from '../types/SocialMedias';
import * as BaseApi from './baseAPI.services';


const updateSocialMediasUser = async (userId: number, token: string, data: SocialMedias): Promise<boolean> => {
    const url: string = 'socialMedias/' + userId;

    const response: Response = await BaseApi.putFetch(url, JSON.stringify(data), token);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.ok;
};

export { updateSocialMediasUser };