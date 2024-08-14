import * as BaseApi from './baseAPI.services';

const getAllPosts = async (url: string) => {
    const response: Response = await BaseApi.getFetch(url);
    const json = await response.json();
    if (!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json.allPostsDTO;
};

const previewPost = async (token: string, data: string) => {
    const url: string = 'posts/preview';

    const response: Response = await BaseApi.postFetch(url, JSON.stringify({content: data}), token);
    const json = await response.json();

    if(!response.ok) {
        throw new Error('An error has occurred: ' + json.message);
    }

    return json;
};

const createPost = async (token: string, data: FormData) => {
    const url: string = 'posts';

    const response: Response = await BaseApi.postFetchWithFile(url, data, token);
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

    return json.postDTO;
};

export { getAllPosts, previewPost, createPost, getPost };
