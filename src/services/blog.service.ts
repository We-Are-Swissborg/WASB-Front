import { PostFormData } from '@/types/Post';
import * as BaseApi from './baseAPI.services';

// const getAllPosts = async (token: string, setToken: (newToken: string) => void) => {
//     const url: string = 'posts';

//     const response: Response = await BaseApi.getFetch(url, token, setToken);
//     const json = await response.json();
//     if (!response.ok) {
//         throw new Error('An error has occurred: ' + json.message);
//     }

//     return json;
// };

// const previewPost = async (token: string, data: FormData, setToken: (newToken: string) => void) => {
//     const url: string = 'posts/preview';

//     const response: Response = await BaseApi.postFetchWithFile(url, data, token, setToken);
//     const json = await response.json();

//     if (!response.ok) {
//         throw new Error('An error has occurred: ' + json.message);
//     }

//     return json;
// };

const createPost = async (token: string, data: PostFormData, setToken: (newToken: string) => void) => {
    const url: string = 'posts';

    const response: Response = await BaseApi.postFetch(url, JSON.stringify(data), token, setToken);
    const json = await response.json();

    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

const getPost = async (id: string) => {
    const url: string = 'posts/' + id;

    const response: Response = await BaseApi.getFetch(url);
    const json = await response.json();

    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

const getPosts = async (id: string) => {
    const url: string = 'posts/' + id;

    const response: Response = await BaseApi.getFetch(url);
    const json = await response.json();

    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

const deletePost = async (id: number, token: string, setToken: (newToken: string) => void) => {
    const url: string = 'posts/' + id;

    const response: Response = await BaseApi.deleteFetch(url, token, setToken);

    if (!response.ok) {
        throw new Error('An error has occurred: with the deletePost');
    }
};

const updatePost = async (id: number, data: PostFormData, token: string, setToken: (newToken: string) => void) => {
    const url: string = 'posts/' + id;

    const response: Response = await BaseApi.putFetch(url, JSON.stringify(data), token, setToken);
    const json = await response.json();

    if (!response.ok) {
        throw new Error('An error has occurred: with the updatePost');
    }

    return json;
};

export {
    // getAllPosts,
    // previewPost,
    createPost,
    getPost,
    getPosts,
    deletePost,
    updatePost
};
