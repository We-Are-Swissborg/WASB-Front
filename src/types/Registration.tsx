export interface Registration {
  id?: number;
  country?: string;
  city?: string;
  firstName?: string;
  lastName?: string;
  pseudo: string;
  email: string;
  wallet: string;
  contribution?: string;
  socialMedias?: {
    twitter?: string,
    discord?: string,
    tiktok?: string,
    telegram?: string
  };
  referral?: string;
  aboutUs?: string;
  creationDate?: Date;
  modificationDate?: Date
}