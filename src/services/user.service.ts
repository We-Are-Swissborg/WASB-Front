import { Registration } from "../types/Registration";
import { postFetch } from './baseAPI.services';

export function userRegistration(registration: Registration) {
    const url = "users/register";
    const body = JSON.stringify(registration);
    const reponse = postFetch(url, body);

    return reponse.then((res: Response) => {
        return res;
    }).catch((error) => {
        return error;
    });
}