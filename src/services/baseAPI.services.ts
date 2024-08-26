const serverURL: string = import.meta.env.VITE_BACKEND_API || '';
const backendAPI: URL = new URL(serverURL, window.location.origin);

const requestHeaders: HeadersInit = new Headers();

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

const getFetch = async (url: string, token?: string | null): Promise<Response> => {
    const options = getOptions;

    if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
    else requestHeaders.delete('Authorization');
    requestHeaders.set('Content-Type', 'application/json');

    options.headers = requestHeaders;

    return await fetch(`${backendAPI.href}/${url}`, options);
};

const postFetch = async (url: string, body: string, token?: string | null): Promise<Response> => {
    const options = postOptions;

    if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
    else requestHeaders.delete('Authorization');
    requestHeaders.set('Content-Type', 'application/json');

    options.headers = requestHeaders;
    options.body = body;

    return await fetch(`${backendAPI.href}/${url}`, options);
};

const postFetchWithFile = async (url: string, body: FormData, token?: string | null): Promise<Response> => {
    const options = postOptions;

    if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
    else requestHeaders.delete('Authorization');

    requestHeaders.delete('Content-Type'); // Not set with multipart/form-data
    options.headers = requestHeaders;
    options.body = body;

    return await fetch(`${backendAPI.href}/${url}`, options);
};

const putFetch = (url: string, body: string, token?: string | null): Promise<Response> => {
    const options = putOptions;

    if(token) requestHeaders.set('Authorization', `Bearer ${token}`);
    else requestHeaders.delete('Authorization');
    requestHeaders.set('Content-Type', 'application/json');

    options.headers = requestHeaders;
    options.body = body;

    return fetch(`${backendAPI.href}/${url}`, options);
};

const deleteFetch = (url: string, token?: string | null): Promise<Response> => {
    const options = deleteOptions;

    if(token) requestHeaders.set('Authorization', `Bearer ${token}`);
    else requestHeaders.delete('Authorization');

    options.headers = requestHeaders;

    return fetch(`${backendAPI.href}/${url}`, options);
};

export { getFetch, postFetch, putFetch, postFetchWithFile, deleteFetch };
