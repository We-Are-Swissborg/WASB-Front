import { Membership } from '@/types/Membership';
import { useTranslation } from 'react-i18next';

export const MembershipList = ({ membershipsList }: Membership[]) => {
    const { t } = useTranslation('global');

    return (
        <>
            Ma liste
        </>
    );
};