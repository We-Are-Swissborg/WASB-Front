import { generateNewToken } from "./token.services";

const serverURL: string = import.meta.env.VITE_BACKEND_API || '';
const backendAPI: URL = new URL(serverURL, window.location.origin);

const requestHeaders: Headers = new Headers();

const getOptions: RequestInit = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
};

const postOptions: RequestInit = {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
};

const putOptions: RequestInit = {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
};

const deleteOptions: RequestInit = {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
};

const patchOptions: RequestInit = {
    method: 'PATCH',
    mode: 'cors',
    cache: 'no-cache',
};

const urlToAddCredentials: string[] = ['refresh'];

function addOptionHeaders(token?: string | null, contentType = 'application/json'): Headers {
    if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
    else requestHeaders.delete('Authorization');
    requestHeaders.set('Content-Type', contentType);

    return requestHeaders;
}

const getFetch = async (url: string, token?: string | null, setToken?: (newToken: string) => void): Promise<Response> => {
    const options = getOptions;

    options.headers = addOptionHeaders(token);
    const res = await fetch(`${backendAPI.href}/${url}`, options);

    if(res.status === 401 && setToken) await generateNewToken(setToken); // Set a new token after a refreshToken.

    return res;
};

const postFetch = async (url: string, body: string, token?: string | null, setToken?: (newToken: string) => void): Promise<Response> => {
    const options = postOptions;

    options.headers = addOptionHeaders(token);
    options.body = body;
    if(urlToAddCredentials.includes(url)) options.credentials = 'include';

    const res = await fetch(`${backendAPI.href}/${url}`, options);

    if(res.status === 401 && setToken) await generateNewToken(setToken); // Set a new token after a refreshToken.

    return res;
};

const postFetchWithFile = async (url: string, body: FormData, token?: string | null, setToken?: (newToken: string) => void): Promise<Response> => {
    const options = postOptions;

    options.headers = addOptionHeaders(token);
    options.body = body;

    requestHeaders.delete('Content-Type'); // Not set with multipart/form-data
    const res = await fetch(`${backendAPI.href}/${url}`, options);

    if(res.status === 401 && setToken) await generateNewToken(setToken); // Set a new token after a refreshToken.

    return res;
};

const putFetch = async (url: string, body: string, token?: string | null, setToken?: (newToken: string) => void): Promise<Response> => {
    const options = putOptions;

    options.headers = addOptionHeaders(token);
    options.body = body;
    const res = await fetch(`${backendAPI.href}/${url}`, options);

    if(res.status === 401 && setToken) await generateNewToken(setToken); // Set a new token after a refreshToken.

    return res;
};

const deleteFetch = async (url: string, token?: string | null, setToken?: (newToken: string) => void): Promise<Response> => {
    const options = deleteOptions;

    options.headers = addOptionHeaders(token);
    const res = await fetch(`${backendAPI.href}/${url}`, options);

    if(res.status === 401 && setToken) await generateNewToken(setToken); // Set a new token after a refreshToken.

    return res;
};

const patchFetch = async (url: string, body: string, token?: string | null, setToken?: (newToken: string) => void): Promise<Response> => {
    const options = patchOptions;

    options.headers = addOptionHeaders(token);
    options.body = body;
    const res = await fetch(`${backendAPI.href}/${url}`, options);

    if(res.status === 401 && setToken) await generateNewToken(setToken); // Set a new token after a refreshToken.

    return res;
};

export { getFetch, postFetch, putFetch, postFetchWithFile, deleteFetch, patchFetch };
