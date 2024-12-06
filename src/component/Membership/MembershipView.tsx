import { Membership } from '@/types/Membership';
import { useTranslation } from 'react-i18next';
import { MembershipForm } from './MembershipForm';
import { useEffect, useState } from 'react';
import { differenceInDays, isBefore, format } from 'date-fns';
import useSWR, { Fetcher } from 'swr';
import { getMemberships } from '@/services/membership.service';
import { useAuth } from '@/contexts/AuthContext';
import { fr } from 'date-fns/locale';

const fetcher: Fetcher<Membership[]> = (token: string) => getMemberships(token);

export const MembershipView = () => {
    const { t } = useTranslation('global');
    const { token } = useAuth();
    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
    const [membership, setMembership] = useState<Membership>();
    const [oldMemberships, setOldMemberships] = useState<Membership[]>();

    const { data, error } = useSWR<Membership[]>(token, fetcher);

    const updateCountdown = () => {
        console.log('updateCountdown', membership);
        if (!membership?.endDateContribution) {
            setDaysRemaining(null);
            return;
        }

        const now = new Date();
        const target = membership.endDateContribution;

        if (isBefore(now, target)) {
            const days = differenceInDays(target, now);
            setDaysRemaining(days);
        } else {
            setDaysRemaining(0);
        }
    };

    useEffect(() => {
        if (data) {
            console.log('setMembership data', data.length);
            setMembership(data[0]);
            setOldMemberships(data);
            updateCountdown();
        }
    }, [data]);

    const handleUpdate = (newAffiliation: Membership) => {
        console.log('handleUpdate membership', newAffiliation);
        setMembership(newAffiliation);
    };

    if (error) return <div>{t('blog.loading-error')}</div>;

    const badgeColor =
        membership?.contributionStatus === 'accepted'
            ? 'bg-success'
            : membership?.contributionStatus === 'in progress'
              ? 'bg-warning'
              : 'bg-danger';

    return (
        <>
            {daysRemaining && daysRemaining < 15 && (
                <span className="badge bg-danger me-1">Ton adhésion se termine dans {daysRemaining} jours</span>
            )}
            {membership && (
                <div className="card shadow mb-4">
                    <div
                        className={`card-header d-flex justify-content-between align-items-center ${badgeColor} text-white`}
                    >
                        <h5 className="mb-0">Adhésion</h5>
                        <span className="badge">{membership.contributionStatus.toUpperCase()}</span>
                    </div>
                    <div className="card-body">
                        <h6 className="card-title">
                            Statut : <span className={`badge ${badgeColor}`}>{membership.contributionStatus}</span>
                        </h6>
                        <p className="card-text">
                            <strong>Montant : </strong>{membership.contribution.amount} CHF
                        </p>
                        <p className="card-text">
                            <strong>Date de la demande : </strong>
                            {format(membership.createdAt, 'dd MMMM yyyy', { locale: fr })}
                        </p>
                        {!!membership.endDateContribution && 
                        <p className="card-text">
                            <strong>Date de fin : </strong> 
                            {format(membership.endDateContribution, 'dd MMMM yyyy', { locale: fr })}
                        </p>
                        }
                    </div>
                </div>
            )}
            {oldMemberships && oldMemberships.length > 1 && (
                <>
                    <div>La liste de tes adhésions</div>
                </>
            )}
            {!membership && (
                <>
                    <div className="card">
                        <div className="card-body">
                            Vous n'êtes pas encore affilié à notre association
                            <p>
                                Pour nous rejoindre, veuillez compléter le formulaire et faire vos envoi via
                                l'application <u>Swissborg</u> en <strong>vCHF</strong>
                            </p>
                        </div>
                    </div>
                    <MembershipForm onUpdate={handleUpdate} />
                </>
            )}
        </>
    );
};
