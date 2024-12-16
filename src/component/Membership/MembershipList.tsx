import { Membership } from '@/types/Membership';

type MembershipListType = {
    membershipList: Membership[];
};

export const MembershipList = ({ membershipList }: MembershipListType) => {
    return (
        <>
            Ma liste
            <ul>
                {membershipList.map((m) => (
                    <li>{m.contributionStatus}</li>
                ))}
            </ul>
        </>
    );
};
