import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AddContribution, Membership } from '../../types/Membership';
import { useTranslation } from 'react-i18next';
import { OptionsSelect } from '../../types/OptionsSelect';
import Select from '../Form/SelectForm';
import * as ContributionService from '@/services/contribution.service';
import { useAuth } from '@/contexts/AuthContext';
import * as MemberShipService from '@/services/membership.service';
import { toast } from 'react-toastify';
import { Contribution } from '@/types/contribution';
import useSWR from 'swr';

type MembershipFormType = {
    onUpdate: (membership: Membership) => void;
};

const fetcheContributions: (token: string, setToken: (newToken: string) => void) => Promise<Contribution[]> = (token, setToken) =>
    ContributionService.getContributions(token, setToken);

export const MembershipForm = ({ onUpdate }: MembershipFormType) => {
    const { t } = useTranslation();
    const { token, setToken } = useAuth();
    const { control, handleSubmit } = useForm<AddContribution>({
        defaultValues: {
            contributionId: 1,
        },
    });
    const [contributionOptions, setContributionOptions] = useState<OptionsSelect[]>();

    const {
        data: contributions,
        error: membershipsError,
        isLoading,
    } = useSWR<Contribution[]>('contributions', () => fetcheContributions(token!, setToken));

    useEffect(() => {
        if (contributions) {
            setContributionOptions(contributions.map((cont) => ({ value: cont.id.toString(), name: cont.title })));
        }
    }, [contributions]);

    const onSubmit = handleSubmit(async (sendData: AddContribution) => {
        try {
            const membership = await MemberShipService.addContribution(sendData, token!, setToken);
            const contribution = contributions!.find((c) => c.id == sendData.contributionId);
            membership.contribution = contribution!;
            onUpdate(membership);
        } catch (e) {
            toast.error(`Erreur lors de la demande d'adhésion.`);
            console.log('ERROR: save new contribution', e);
        }
    });

    if (isLoading) return <div>{t('common.loading')}</div>;
    if (membershipsError) return <div>{t('profile.manage-membership.error-load-contribution')}</div>;

    return (
        <>
            <form className="form all-form-profile" onSubmit={onSubmit}>
                {contributionOptions && (
                    <>
                        <Controller
                            name="contributionId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={contributionOptions}
                                    isOptionNone={false}
                                    label={t(`profile.manage-membership.${field.name}`)}
                                />
                            )}
                        />
                    </>
                )}
                <button className="btn btn-form padding-button mt-3" type="submit">
                    {t('profile.update')}
                </button>
            </form>
        </>
    );
};
