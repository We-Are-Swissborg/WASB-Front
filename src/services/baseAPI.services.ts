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

const getFetch = (url: string, token?: string | null): Promise<Response> => {
    const options = getOptions;

    if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
    else requestHeaders.delete('Authorization');

    options.headers = requestHeaders;

    return fetch(`${backendAPI.href}/${url}`, options);
};

const postFetch = (url: string, body: string, token?: string | null): Promise<Response> => {
    const options = postOptions;

    if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
    else requestHeaders.delete('Authorization');

    options.headers = requestHeaders;
    options.body = body;

    return fetch(`${backendAPI.href}/${url}`, options);
};

export { getFetch, postFetch };
