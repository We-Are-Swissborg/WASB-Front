import { Membership } from '@/types/Membership';
import { useTranslation } from 'react-i18next';

type MembershipListType = {
    membershipList: Membership[];
};

export const MembershipList = ({ membershipList }: MembershipListType) => {
    const { t } = useTranslation('global');

    return (
        <>
            Ma liste
            <ul>
                {membershipList.map(m => (
                    <li>{m.contributionStatus}</li>
                ))}
            </ul>
        </>
    );
};