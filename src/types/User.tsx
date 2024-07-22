import { SocialMedias } from './SocialMedia';

export type User = {
    id?: number;
    country?: string;
    city?: string;
    firstName?: string;
    lastName?: string;
    username: string;
    email: string;
    walletAddress: string;
    contribution?: string;
    socialMedias?: SocialMedias;
    referral?: string;
    aboutUs?: string;
    confidentiality: boolean;
    beContacted?: boolean;
}
