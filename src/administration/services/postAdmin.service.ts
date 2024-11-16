import { Post } from '@/types/Post';
import * as BaseApi from './baseAPI.service';

/**
 * Get all Posts
 * @param token
 * @returns
 */
const getAllPosts = async (token: string) => {
    const url: string = 'posts';

    const response: Response = await BaseApi.getFetch(url, token);
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
const getPost = async (id: number, token: string): Promise<Post> => {
    const url: string = `posts/${id}`;
    const response: Response = await BaseApi.getFetch(url, token);
    const json = await response.json();
    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

/**
 * Create a new Post
 * @param token
 * @param data
 * @returns
 */
const create = async (token: string, data: Post) => {
    const url: string = 'posts';

    const response: Response = await BaseApi.postFetch(url, JSON.stringify(data), token);
    const json = await response.json();
    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

/**
 * Update a Post
 * @param token
 * @param data
 * @returns
 */
const update = async (id: number, token: string, data: Post) => {
    const url: string = `posts/${id}`;

    const response: Response = await BaseApi.putFetch(url, JSON.stringify(data), token);
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
 * @returns
 */
const destroy = async (id: number, token: string): Promise<boolean> => {
    const url: string = `posts/${id}`;

    const response: Response = await BaseApi.deleteFetch(url, token);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.ok;
};

export { getPost, getAllPosts, create, update, destroy };
