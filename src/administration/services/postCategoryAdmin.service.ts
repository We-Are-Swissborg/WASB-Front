import * as BaseApi from './baseAPI.service';
import { PostCategoryFormData } from '@/types/PostCategory';

/**
 * Update post category
 * @param id
 * @param token
 * @param data
 * @returns
 */
const updatePostCategory = async (id: number, token: string, data: PostCategoryFormData): Promise<boolean> => {
    const url: string = `postCategories/${id}`;

    const response: Response = await BaseApi.putFetch(url, JSON.stringify(data), token);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.ok;
};

/**
 * Create post category
 * @param token
 * @param data
 * @returns
 */
const createPostCategory = async (token: string, data: PostCategoryFormData): Promise<boolean> => {
    const url: string = `postCategories`;

    const response: Response = await BaseApi.postFetch(url, JSON.stringify(data), token);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.ok;
};

/**
 * Retrieve all post categories
 * @param token token
 * @returns all categories
 */
const getPostCategories = async (token: string): Promise<PostCategoryFormData[]> => {
    const url: string = 'postCategories';

    const response: Response = await BaseApi.getFetch(url, token);
    const json = await response.json();

    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

/**
 * Get a Post Category
 * @param token token
 * @returns parameter
 */
const getPostCategory = async (id: number, token: string): Promise<PostCategoryFormData> => {
    const url: string = `postCategories/${id}`;

    const response: Response = await BaseApi.getFetch(url, token);
    const json = await response.json();

    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

/**
 * Delete a Post Category
 * @param id
 * @param token
 * @returns
 */
const deletePostCategory = async (id: number, token: string): Promise<boolean> => {
    const url: string = `postCategories/${id}`;

    const response: Response = await BaseApi.deleteFetch(url, token);

    if (!response.ok) {
        const json = await response.json();
        throw new Error('An error has occurred: ' + json.message);
    }

    return response.ok;
};

export { updatePostCategory, getPostCategories, getPostCategory, createPostCategory, deletePostCategory };
