import { SocialMedias } from './SocialMedia';

export interface User {
    id?: number;
    country?: string;
    city?: string;
    firstName?: string;
    lastName?: string;
    username: string;
    email: string;
    password: string;
    walletAddress: string;
    contribution?: string;
    socialMedias?: SocialMedias;
    referral?: string;
    aboutUs?: string;
    confidentiality: boolean;
    beContacted?: boolean;
}