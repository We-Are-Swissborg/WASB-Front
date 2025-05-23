import { Address } from './Address';
import { User } from './User';

export type PaginatedSessionsResponse = {
    sessions: CardSession[];
    currentPage: number;
    totalPages: number;
    totalSessions: number;
    limit: number;
};

export type CardSession = {
    id: number;
    title: string;
    slug: string;
    status: SessionStatus;
    image64: string;
    startDateTime: Date;
    endDateTime?: Date;
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
    address: Address;
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
