import { TranslationData } from "./Translation";

export type PostCategory = {
    id: number;
    translations: TranslationData[];
    createdAt: Date;
    updatedAt?: Date;
};

export type PostCategoryCard = {
    id: number;
    title: string;
};

export type PostCategoryFormData = {
    id?: number;
    translations: TranslationData[];
    createdAt: Date;
    updatedAt?: Date;
};