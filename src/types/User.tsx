import { Membership } from './Membership';
import { SocialMedias } from './SocialMedias';

export type User = {
    id?: number;
    country?: string;
    city?: string;
    firstName?: string;
    lastName?: string;
    username: string;
    email: string;
    password?: string;
    walletAddress: string;
    aboutUs?: string;
    membership?: Membership;
    socialMedias?: SocialMedias;
    confidentiality: boolean;
    beContacted: boolean;
    referralCode: string;
};
