export type Membership = {
    contributionStatus: 'no adherent' | 'in progress' | 'adherent' | 'not accepted';
    dateContribution?: Date;
    endDateContribution?: Date;
    contribution?: string;
};
