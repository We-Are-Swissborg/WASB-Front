import { Membership } from '@/types/Membership';
import { differenceInDays, isBefore } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type MembershipReminderType = {
    lastMembership: Membership | undefined;
};

export const MembershipReminder = ({ lastMembership }: MembershipReminderType) => {
    const { t } = useTranslation();
    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

    const updateCountdown = () => {
        if (!lastMembership?.endDateContribution) {
            setDaysRemaining(null);
            return;
        }

        const now = new Date();
        const target = lastMembership.endDateContribution;

        if (isBefore(now, target)) {
            const days = differenceInDays(target, now);
            setDaysRemaining(days);
        } else {
            setDaysRemaining(0);
        }
    };

    useEffect(() => {
        if (lastMembership) updateCountdown();
    }, [lastMembership]);

    return (
        <>
            {!!daysRemaining && daysRemaining < 15 && (
                <span className="badge bg-danger me-1">{t('profile.manage-membership.reminder')}</span>
            )}
        </>
    );
};
