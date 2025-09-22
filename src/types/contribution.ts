export type Contribution = {
    id: number;
    title: string;
    amount: number;
    duration: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
};
