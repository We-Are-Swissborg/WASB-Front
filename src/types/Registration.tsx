export interface Registration {
  id?: number;
  country?: string;
  city?: string;
  firstName?: string;
  lastName?: string;
  pseudo: string;
  email: string;
  walletAddress: string;
  contribution?: string;
  socialMedias?: {
    twitter?: string,
    discord?: string,
    tiktok?: string,
    telegram?: string
  };
  referral?: string;
  aboutUs?: string;
  confidentiality: boolean;
  beContacted?: boolean;
}
