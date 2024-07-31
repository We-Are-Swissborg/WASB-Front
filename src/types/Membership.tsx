export type Membership = {
    contributionStatus: 'no adherent' | 'in progress' | 'adherent' | 'not accepted';
    dateContribution?: Date | null;
    endDateContribution?: Date | null;
    contribution?: string;
};