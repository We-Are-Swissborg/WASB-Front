const serverURL: string = import.meta.env.VITE_BACKEND_API || '';
const backendAPI: URL = new URL(serverURL, window.location.origin);

const requestHeaders: HeadersInit = new Headers();
requestHeaders.set('Content-Type', 'application/json');

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

const getFetch = async (url: string, token?: string | null): Promise<Response> => {
    const options = getOptions;

    if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
    else requestHeaders.delete('Authorization');

    options.headers = requestHeaders;

    return await fetch(`${backendAPI.href}/${url}`, options);
};

const postFetch = async (url: string, body: string, token?: string | null): Promise<Response> => {
    const options = postOptions;

    if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
    else requestHeaders.delete('Authorization');

    options.headers = requestHeaders;
    options.body = body;

    return await fetch(`${backendAPI.href}/${url}`, options);
};

const putFetch = (url: string, body: string, token?: string | null): Promise<Response> => {
    const options = putOptions;

    if(token) requestHeaders.set('Authorization', `Bearer ${token}`);
    else requestHeaders.delete('Authorization');

    options.headers = requestHeaders;
    options.body = body;

    return fetch(`${backendAPI.href}/${url}`, options);
};

export { getFetch, postFetch, putFetch };
