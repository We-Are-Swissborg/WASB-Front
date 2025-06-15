import { PostFormData, PostFormState } from '@/types/Post';
import * as BaseApi from './baseAPI.service';

/**
 * Get all Posts
 * @param token
 * @param setToken
 * @returns
 */
const getAllPosts = async (token: string, setToken: (newToken: string) => void) => {
    const url: string = 'posts';

    const response: Response = await BaseApi.getFetch(url, token, setToken);
    const json = await response.json();
    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

/**
 *
 * @param token
 * @returns
 */
const getPost = async (id: number, token: string, setToken: (newToken: string) => void): Promise<PostFormState> => {
    const url: string = `posts/${id}`;
    const response: Response = await BaseApi.getFetch(url, token, setToken);
    const json = await response.json();
    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

/**
 * Create a new Post
 * @param token
 * @param setToken
 * @param data
 * @returns
 */
const create = async (token: string, data: PostFormData, setToken: (newToken: string) => void) => {
    const url: string = 'posts';

    const response: Response = await BaseApi.postFetch(url, JSON.stringify(data), token, setToken);
    const json = await response.json();
    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

/**
 * Update a Post
 * @param token
 * @param setToken
 * @param data
 * @returns
 */
const update = async (id: number, token: string, data: PostFormData, setToken: (newToken: string) => void) => {
    const url: string = `posts/${id}`;

    const response: Response = await BaseApi.putFetch(url, JSON.stringify(data), token, setToken);
    const json = await response.json();
    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

/**
 * Delete post
 * @param id
 * @param token
 * @param setToken
 * @returns
 */
const destroy = async (id: number, token: string, setToken: (newToken: string) => void): Promise<boolean> => {
    const url: string = `posts/${id}`;

    const response: Response = await BaseApi.deleteFetch(url, token, setToken);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.ok;
};

export { getPost, getAllPosts, create, update, destroy };
