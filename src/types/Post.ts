import { User } from './User';

export type CardPost = {
    author: number;
    id: number;
    title: string;
    image: Blob;
    infoAuthor: User;
    updatedAt: Date;
};

export type Post = {
    author: number;
    id: number;
    title: string;
    image: Blob;
    content: string;
    infoAuthor: User;
    updatedAt: Date;
    createdAt: Date;
    isPublish: boolean;
    publishedAt: Date | null;
    slug: string;
};
