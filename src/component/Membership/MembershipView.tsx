import { Membership } from '@/types/Membership';
import { useTranslation } from 'react-i18next';
import { MembershipForm } from './MembershipForm';
import { useEffect, useState } from 'react';
import { differenceInDays, isBefore, format } from 'date-fns';
import useSWR from 'swr';
import { getMemberships } from '@/services/membership.service';
import { useAuth } from '@/contexts/AuthContext';
import { fr } from 'date-fns/locale';
import { MembershipList } from './MembershipList';
import { Parameter } from '@/types/Parameter';
import { getParametersByCode } from '@/services/setting.service';

const fetcherMemberships: (token: string) => Promise<Membership[]> = (token) => getMemberships(token);
const fetcherParameters: (token: string) => Promise<Parameter[]> = (token) =>
    getParametersByCode('membership#phone', token);

export const MembershipView = () => {
    const { t } = useTranslation('global');
    const { token, username } = useAuth();
    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
    const [membership, setMembership] = useState<Membership>();
    const [oldMemberships, setOldMemberships] = useState<Membership[]>();

    const { data: memberships, error: membershipsError } = useSWR<Membership[]>('memberships', () =>
        fetcherMemberships(token!),
    );
    const { data: parameters, error: parametersError } = useSWR<Parameter[]>('parameters_membership', () =>
        fetcherParameters(token!),
    );

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
        if (memberships) {
            console.log('setMembership data', memberships.length);
            setMembership(memberships[0]);
            setOldMemberships(memberships);
            updateCountdown();
        }
    }, [memberships]);

    const handleUpdate = (newAffiliation: Membership) => {
        console.log('handleUpdate membership', newAffiliation);
        setMembership(newAffiliation);
    };

    if (membershipsError || parametersError) return <div>{t('blog.loading-error')}</div>;

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
                            <strong>Montant : </strong>
                            {membership.contribution.amount} CHF
                        </p>
                        <p className="card-text">
                            <strong>Date de la demande : </strong>
                            {format(membership.createdAt, 'dd MMMM yyyy', { locale: fr })}
                        </p>
                        {!!membership.endDateContribution && (
                            <p className="card-text">
                                <strong>Date de fin : </strong>
                                {format(membership.endDateContribution, 'dd MMMM yyyy', { locale: fr })}
                            </p>
                        )}
                    </div>
                </div>
            )}
            {oldMemberships && oldMemberships.length > 1 && (
                <>
                    <MembershipList membershipList={oldMemberships} />
                </>
            )}
            {!membership && (
                <>
                    <div className="card">
                        <div className="card-body">
                            Vous n'êtes pas encore affilié à notre association
                            <p>
                                {parameters && (
                                    <>
                                        Pour nous rejoindre, veuillez choisir votre adhésion et faire un envoi via
                                        l'application <u>Swissborg</u> en <strong>vCHF</strong>
                                        <br />
                                        "Smart Send" :{' '}
                                        {parameters.map((p) => (
                                            <span>{p.value}</span>
                                        ))}
                                        <br />
                                        Avec la communication : "New membership {username}"
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                    <MembershipForm onUpdate={handleUpdate} />
                </>
            )}
        </>
    );
};
