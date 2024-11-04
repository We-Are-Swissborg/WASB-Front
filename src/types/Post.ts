
import { PostCategory } from './PostCategory';
import { User } from './User';

export type PaginatedPostsResponse = {
    posts: CardPost[];             
    currentPage: number;      
    totalPages: number;        
    totalPosts: number;         
    limit: number;              
}

export type CardPost = {
    id: number;
    title: string;
    slug: string;
    image64: string;
    infoAuthor: User;
    publishedAt: Date;
    categories: PostCategory[];
};

export type Post = {
    author: number;
    id: number;
    title: string;
    image: string;
    image64: string;
    content: string;
    infoAuthor: User;
    updatedAt: Date;
    createdAt: Date;
    isPublish: boolean;
    publishedAt: Date;
    slug: string;
    categories: PostCategory[];
};

export type PostFormData = Omit<Post, 'categories'> & { categories: number[] };
