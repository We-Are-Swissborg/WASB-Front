const serverURL: string = import.meta.env.VITE_BACKEND_API || '';
const backendAPI: URL = new URL(serverURL, window.location.origin);

const requestHeaders: Headers = new Headers();
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

const patchOptions: RequestInit = {
    method: 'PATCH',
    mode: 'cors',
    cache: 'no-cache',
};

function addOptionHeaders(token?: string | null): Headers {
    if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
    else requestHeaders.delete('Authorization');

    return requestHeaders;
}

const getFetch = async (url: string, token?: string | null): Promise<Response> => {
    const options = getOptions;

    options.headers = addOptionHeaders(token);

    return await fetch(`${backendAPI.href}/${url}`, options);
};

const postFetch = async (url: string, body: string, token?: string | null): Promise<Response> => {
    const options = postOptions;

    options.headers = addOptionHeaders(token);
    options.body = body;

    return await fetch(`${backendAPI.href}/${url}`, options);
};

const putFetch = (url: string, body: string, token?: string | null): Promise<Response> => {
    const options = putOptions;

    options.headers = addOptionHeaders(token);
    options.body = body;

    return fetch(`${backendAPI.href}/${url}`, options);
};

const patchFetch = (url: string, body: string, token?: string | null): Promise<Response> => {
    const options = patchOptions;

    options.headers = addOptionHeaders(token);
    options.body = body;

    return fetch(`${backendAPI.href}/${url}`, options);
};

export { getFetch, postFetch, putFetch, patchFetch };
