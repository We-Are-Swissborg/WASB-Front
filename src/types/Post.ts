import { PostCategory } from './PostCategory';
import { TranslationData } from './Translation';
import { User } from './User';

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
    infoAuthor?: Omit<User, 'membership'>;
    publishedAt: Date;
    categories: PostCategory[];
};

export type Post = {
    author: number;
    id: number;
    image: string;
    image64: string;
    content: string;
    infoAuthor: Omit<User, 'membership'>;
    createdAt: Date;
    updatedAt?: Date;
    isPublish: boolean;
    publishedAt?: Date;
    translations: TranslationData[];
    categories: PostCategory[];
};

export type PostFormData = {
    author: number;
    id?: number;
    image: string;
    isPublish: boolean;
    publishedAt?: Date;
    translations: {
        fr: { languageCode: 'fr'; title: string; content: string; slug: string };
        en: { languageCode: 'en'; title: string; content: string; slug: string };
    };
    categories: number[];
    createdAt: Date;
    updatedAt?: Date;
};
