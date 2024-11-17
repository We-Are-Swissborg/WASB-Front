import { Contribution } from './contribution';

export type AddContribution = {
    contributionId: number;
};

export type Membership = {
    id: number;
    contributionStatus: 'in progress' | 'accepted' | 'not accepted';
    dateContribution: Date;
    endDateContribution?: Date;
    contributionId: number;
    contribution: Contribution;
    note: string;
    createdAt: Date;
    updatedAt: Date;
};
