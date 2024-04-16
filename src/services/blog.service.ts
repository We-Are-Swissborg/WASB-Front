import { Post } from "../types/Post";

const getPosts = async function () {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=10");
    const posts = await response.json() as Post[];
    return posts;
}

export { getPosts }