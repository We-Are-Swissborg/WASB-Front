import { PostCategory } from './PostCategory';
import { User } from './User';

export type PaginatedPostsResponse = {
    sessions: CardSession[];
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    limit: number;
};

export type CardSession = {
    id: number;
    title: string;
    slug: string;
    image64: string;
    infoAuthor?: Omit<User, 'membership'>;
    publishedAt: Date;
    categories: PostCategory[];
};

export type Session = {
    id: number;
    title: string;
    slug: string;
    image64: string;
    description: string;
    image: string;
    startDateTime: Date;
    endDateTime?: Date;
    organizerBy?: Omit<User, 'membership'>;
    numberOfParticipants: number;
    url: string;
    membersOnly: boolean;
    status: SessionStatus;
    createdAt: Date;
    createdBy: Omit<User, 'membership'>;
    updatedAt: Date;
    updatedBy: Omit<User, 'membership'>;
};

export enum SessionStatus {
    Planned = 'Planned',
    Ongoing = 'Ongoing',
    Completed = 'Completed',
    Cancelled = 'Cancelled',
    Postponed = 'Postponed',
    Draft = 'Draft',
}
