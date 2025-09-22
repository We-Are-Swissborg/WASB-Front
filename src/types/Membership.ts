import { Contribution } from './contribution';
import { User } from './User';

export type AddContribution = {
    contributionId: number;
};

export type Membership = {
    id: number;
    contributionStatus: 'in progress' | 'accepted' | 'not accepted';
    dateContribution?: Date;
    endDateContribution?: Date;
    contributionId: number;
    contribution: Contribution;
    note: string;
    user: User;
    userId: number;
    validateUserId?: number;
    validateBy?: User;
    createdAt: Date;
    updatedAt?: Date;
};
