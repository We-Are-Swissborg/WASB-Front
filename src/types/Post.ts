import { PostCategory, PostCategoryFormData } from './PostCategory';
import { TranslationData } from './Translation';

export type PaginatedPostsResponse = {
    posts: CardPost[];
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    limit: number;
};

export type CardPost = {
    id: number;
    title: string;
    slug: string;
    image64: string;
    publishedAt: Date;
    categories: PostCategory[];
    author: string;
};

export type Post = {
    id: number;
    title: string;
    image: string;
    image64: string;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    isPublish: boolean;
    publishedAt?: Date;
    author: string;
    categories: PostCategory[];
};

export type PostFormData = {
    author: number;
    id?: number;
    image: string;
    isPublish: boolean;
    publishedAt?: Date;
    translations: TranslationData[];
    categories: PostCategoryFormData[];
    createdAt: Date;
    updatedAt?: Date;
};

export type PostFormState = PostFormData & {
    image64?: string;
};
