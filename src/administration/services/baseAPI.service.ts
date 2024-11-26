const serverURL: string = import.meta.env.VITE_BACKEND_API || '';
const backendAPI: URL = new URL(`${serverURL}/admin`, window.location.origin);

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

function addOptionHeaders(token: string, contentType = 'application/json'): Headers {
    requestHeaders.set('Authorization', `Bearer ${token}`);
    requestHeaders.set('Content-Type', contentType);

    return requestHeaders;
}

const getFetch = async (url: string, token: string): Promise<Response> => {
    const options = getOptions;

    options.headers = addOptionHeaders(token);

    return await fetch(`${backendAPI.href}/${url}`, options);
};

const postFetch = async (url: string, body: string, token: string): Promise<Response> => {
    const options = postOptions;

    options.headers = addOptionHeaders(token);
    options.body = body;

    return await fetch(`${backendAPI.href}/${url}`, options);
};

const postFetchWithFile = async (url: string, body: FormData, token: string): Promise<Response> => {
    const options = postOptions;

    options.headers = addOptionHeaders(token);
    options.body = body;

    requestHeaders.delete('Content-Type'); // Not set with multipart/form-data

    return await fetch(`${backendAPI.href}/${url}`, options);
};

const putFetch = (url: string, body: string, token: string): Promise<Response> => {
    const options = putOptions;

    options.headers = addOptionHeaders(token);
    options.body = body;

    return fetch(`${backendAPI.href}/${url}`, options);
};

const deleteFetch = (url: string, token: string): Promise<Response> => {
    const options = deleteOptions;

    options.headers = addOptionHeaders(token);

    return fetch(`${backendAPI.href}/${url}`, options);
};

const patchFetch = (url: string, body: string, token: string): Promise<Response> => {
    const options = patchOptions;

    options.headers = addOptionHeaders(token);
    options.body = body;

    return fetch(`${backendAPI.href}/${url}`, options);
};

export { getFetch, postFetch, putFetch, postFetchWithFile, deleteFetch, patchFetch };
