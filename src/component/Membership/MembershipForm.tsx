import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AddContribution, Membership } from '../../types/Membership';
import { useTranslation } from 'react-i18next';
import { OptionsSelect } from '../../types/OptionsSelect';
import Select from '../Form/SelectForm';
import * as ContributionService from '@/services/contribution.service';
import { useAuth } from '@/contexts/AuthContext';
import * as MemberShipService from '@/services/membership.service';
import { toast } from 'react-toastify';

type MembershipFormType = {
    onUpdate: (membership: Membership) => void;
};

export const MembershipForm = ({onUpdate}: MembershipFormType) => {
    const { t } = useTranslation('global');
    const { token } = useAuth();
    const {
        control,
        handleSubmit,
    } = useForm<AddContribution>();
    const [contributionOptions, setContributionOptions] = useState<OptionsSelect[]>();

    const initContributions  = useCallback(async () => {
        const c = await ContributionService.getContributions(token!);
        setContributionOptions(c.map((cont) => ({ value: cont.id.toString(), name: cont.title})));
    }, []);

    useEffect(() => {
        initContributions();
    }, [initContributions]);

    const onSubmit = handleSubmit(async (sendData: AddContribution) => {
        try {
            const membership = await MemberShipService.addContribution(sendData, token!);            
            onUpdate(membership);
        } catch (e) {
            toast.error(`Erreur lors de la demande d'adhésion.`);
            console.log('ERROR: save new contribution', e);
        }
    });

    return (
        <>
            <form className="form all-form-profile" onSubmit={onSubmit}>
                {contributionOptions && <>
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
                </>}
                <button className="btn btn-form padding-button mt-3" type="submit">
                    {t('profile.update')}
                </button>
            </form>
        </>
    );
};
