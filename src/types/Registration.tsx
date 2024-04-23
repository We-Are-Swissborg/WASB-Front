export interface Registration {
  id?: number;
  country: string;
  firstName: string;
  lastName: string;
  pseudo: string;
  email: string;
  wallet: string;
  socialMedias?: {
    twitter?: string,
    discord?: string,
    tiktok?: string,
    telegram?: string
  };
  referral?: string;
  detailsOther?: string;
}