import { SocialMedias } from '../types/SocialMedias';
import * as BaseApi from './baseAPI.services';


const updateSocialMediasUser = async (userId: number, token: string, data: SocialMedias): Promise<undefined> => {
    const url: string = 'socialMedias/' + userId;

    const response: Response = await BaseApi.putFetch(url, JSON.stringify(data), token);
    const json = await response.json();

    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }
    
    return json;
};

export { updateSocialMediasUser };