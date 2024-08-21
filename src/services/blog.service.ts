import { FieldValues } from 'react-hook-form';
import * as BaseApi from './baseAPI.services';

const getAllPosts = async () => {
    const url: string = 'posts';

    const response: Response = await BaseApi.getFetch(url);
    const json = await response.json();
    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

const previewPost = async (token: string, data: FormData) => {
    const url: string = 'posts/preview';

    const response: Response = await BaseApi.postFetchWithFile(url, data, token);
    const json = await response.json();

    if(!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

const createPost = async (token: string, data: FieldValues) => {
    const url: string = 'posts';

    const response: Response = await BaseApi.postFetch(url, JSON.stringify(data), token);
    const json = await response.json();

    if(!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

const getPost = async (id: string) => {
    const url: string = 'posts/' + id;

    const response: Response = await BaseApi.getFetch(url);
    const json = await response.json();

    if(!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

const getPostRange = async (url: string) => {
    const response: Response = await BaseApi.getFetch(url);
    const json = await response.json();

    if(!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

export { getAllPosts, previewPost, createPost, getPost, getPostRange };
