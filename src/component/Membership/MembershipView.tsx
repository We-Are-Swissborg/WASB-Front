import { Membership } from '@/types/Membership';
import { useTranslation } from 'react-i18next';
import { MembershipForm } from './MembershipForm';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { getMemberships } from '@/services/membership.service';
import { UseAuth } from '@/contexts/AuthContext';
import { MembershipList } from './MembershipList';
import Loading from '../Loading';
import { MembershipReminder } from './MembershipReminder';
import { MembershipCard } from './MembershipCard';
import { MembershipMessage } from './MembershipMessage';
import { isBefore } from 'date-fns';

const fetcherMemberships: (token: string, setToken: (newToken: string) => void) => Promise<Membership[]> = (token, setToken) => getMemberships(token, setToken);

export const MembershipView = () => {
    const { t } = useTranslation();
    const { token, setToken } = UseAuth();
    const [membership, setMembership] = useState<Membership>();
    const [oldMemberships, setOldMemberships] = useState<Membership[]>();
    const [isDisplayNewAffiliation, setIsDisplayNewAffiliation] = useState<boolean>(true);

    const {
        data: memberships,
        error: membershipsError,
        isLoading: membershpsLoading,
    } = useSWR<Membership[]>('memberships', () => fetcherMemberships(token!, setToken));

    useEffect(() => {
        if (memberships) {
            setMembership(memberships[0]);
            setOldMemberships(memberships);
        }
    }, [memberships]);

    const handleUpdate = (newAffiliation: Membership) => {
        setMembership(newAffiliation);
    };

    useEffect(() => {
        if (!membership || (membership.endDateContribution && isBefore(membership.endDateContribution, new Date()))) {
            setIsDisplayNewAffiliation(true);
        } else {
            setIsDisplayNewAffiliation(false);
        }
    }, [membership]);

    if (membershipsError) return <div>{t('blog.loading-error')}</div>;
    if (membershpsLoading) return <Loading />;

    return (
        <>
            <MembershipReminder lastMembership={membership} />

            {isDisplayNewAffiliation && (
                <>
                    <MembershipMessage />
                    <MembershipForm onUpdate={handleUpdate} />
                </>
            )}
            {membership && <MembershipCard lastMembership={membership} />}
            {oldMemberships && oldMemberships.length > 1 && (
                <>
                    <MembershipList membershipList={oldMemberships} />
                </>
            )}
        </>
    );
};
