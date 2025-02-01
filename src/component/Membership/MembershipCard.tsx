import { Membership } from '@/types/Membership';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

type MembershipCardType = {
    lastMembership: Membership;
};

export const MembershipCard = ({ lastMembership }: MembershipCardType) => {
    const { t } = useTranslation();

    const badgeColor =
        lastMembership?.contributionStatus === 'accepted'
            ? 'bg-success'
            : lastMembership?.contributionStatus === 'in progress'
              ? 'bg-warning'
              : 'bg-danger';

    return (
        <>
            <div className="card shadow mb-4">
                <div
                    className={`card-header d-flex justify-content-between align-items-center ${badgeColor} text-white`}
                >
                    <h5 className="mb-0">{t('profile.manage-membership.title-card')}</h5>
                    <span className="badge">{lastMembership.contributionStatus.toUpperCase()}</span>
                </div>
                <div className="card-body">
                    <h6 className="card-title">
                        {t('profile.manage-membership.status')} :{' '}
                        <span className={`badge ${badgeColor}`}>{lastMembership.contributionStatus}</span>
                    </h6>
                    <p className="card-text">
                        <strong>{t('profile.manage-membership.amount')} : </strong>
                        {lastMembership.contribution.amount} CHF
                    </p>
                    <p className="card-text">
                        <strong>{t('profile.manage-membership.date-request')} : </strong>
                        {format(lastMembership.createdAt, 'dd MMMM yyyy', { locale: fr })}
                    </p>
                    {!!lastMembership.endDateContribution && (
                        <p className="card-text">
                            <strong>{t('profile.manage-membership.end-date')} : </strong>
                            {format(lastMembership.endDateContribution, 'dd MMMM yyyy', { locale: fr })}
                        </p>
                    )}
                    <p>
                        {t('profile.manage-membership.comment')} :
                        <TextareaAutosize
                            minRows={2}
                            maxRows={8}
                            id="note"
                            className="form-control"
                            value={lastMembership.note}
                            disabled
                            style={{ resize: 'none' }}
                        />
                    </p>
                </div>
            </div>
        </>
    );
};
