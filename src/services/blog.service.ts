import { Post } from "../types/Post";

const getPosts = async function (url: string) {
    const response = await fetch(url);
    const posts = await response.json() as Post[];
    return posts;
};

export { getPosts };
