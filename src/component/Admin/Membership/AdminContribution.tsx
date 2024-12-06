import * as ContributionService from '@/administration/services/contributionsAdmin.service';
import { useAuth } from '@/contexts/AuthContext';
import { Contribution } from '@/types/contribution';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { fr } from 'date-fns/locale';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AdminContribution() {
    const navigate = useNavigate();
    const { t } = useTranslation('global');
    const { token } = useAuth();
    const { id } = useParams();
    const [contribution, setContribution] = useState<Contribution>();
    const [isInitializing, setIsInitializing] = useState<boolean>(false);

    const { register, handleSubmit, control, formState, setValue } = useForm<Contribution>({
        mode: 'onTouched',
        defaultValues: {
            isActive: false,
        },
    });
    const { isSubmitting, errors, isDirty, isValid } = formState;

    const initContribution = useCallback(
        async (contribution: Contribution) => {
            setContribution(contribution);
            setValue('createdAt', new Date(contribution.createdAt));
            setValue('updatedAt', contribution.updatedAt ? new Date(contribution.updatedAt) : undefined);
            setValue('title', contribution.title);
            setValue('amount', contribution.amount);
            setValue('duration', contribution.duration);
            setValue('isActive', contribution.isActive);
            setValue('id', contribution.id);
        },
        [setValue],
    );

    const getContribution = useCallback(async () => {
        if (id && token) {
            try {
                const contribution = await ContributionService.getContribution(Number(id), token);
                initContribution(contribution);
            } catch (error) {
                toast.error('Erreur lors du chargement de la contribution');
                console.error(error);
            }
        }
    }, [token, id, initContribution]);

    const initForm = useCallback(async () => {
        try {
            await getContribution();
        } catch (e) {
            toast.error(`Erreur lors de l'initialisation du formulaire`);
            console.log('ERROR: init Form Contribution', e);
        } finally {
            setIsInitializing(true);
        }
    }, [getContribution]);

    useEffect(() => {
        if (!isInitializing) {
            initForm();
        }
    }, [initForm, isInitializing]);

    const onSubmit = async (data: Contribution) => {
        if (isDirty && isValid) {
            try {
                if (data.id) {
                    await ContributionService.updateContribution(data.id, data, token!);
                    toast.success(t('contribution.update'));
                } else {
                    await ContributionService.createContribution(data, token!);
                    toast.success(t('contribution.create'));
                }
                navigate('/admin/contributions');
            } catch {
                toast.error(t('contribution.error'));
            }
        }
    };

    if (!isInitializing) {
        return <div>{t('common.loading')}</div>;
    }

    return (
        <div className="container-fluid">
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="row g-3">
                        <legend>Contribution</legend>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <TextField
                                type="text"
                                id="title"
                                label="Titre"
                                className="form-control"
                                {...register('title', {
                                    required: 'this is a required',
                                    maxLength: {
                                        value: 100,
                                        message: 'Max length is 100',
                                    },
                                    minLength: {
                                        value: 3,
                                        message: 'Min length is 3',
                                    },
                                })}
                                required
                            />
                            {errors?.title && <div className="text-danger">{errors.title.message}</div>}
                        </div>
                        {!!contribution?.createdAt && (
                            <>
                                <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                                    <Controller
                                        name="createdAt"
                                        control={control}
                                        render={({ field }) => (
                                            <DateTimePicker
                                                label="Créer le"
                                                value={field?.value}
                                                onChange={(newValue) => field.onChange(newValue)}
                                                disabled
                                                sx={{ width: '100%' }}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                                    <Controller
                                        name="updatedAt"
                                        control={control}
                                        render={({ field }) => (
                                            <DateTimePicker
                                                label="Mise à jour le"
                                                value={field?.value}
                                                onChange={(newValue) => field.onChange(newValue)}
                                                disabled
                                                sx={{ width: '100%' }}
                                            />
                                        )}
                                    />
                                </div>
                            </>
                        )}
                    </fieldset>
                    <fieldset className="row g-3">
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <TextField
                                type="number"
                                id="amount"
                                label="Montant"
                                className="form-control"
                                {...register('amount', {
                                    required: 'this is a required',
                                })}
                                required
                            />
                            {errors?.amount && <div className="text-danger">{errors.amount.message}</div>}
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <TextField
                                type="number"
                                id="duration"
                                label="Durée"
                                className="form-control"
                                {...register('duration', {
                                    required: 'this is a required',
                                })}
                                required
                            />
                            {errors?.duration && <div className="text-danger">{errors.duration.message}</div>}
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <FormControlLabel
                                className="form-check"
                                control={
                                    <Controller
                                        name="isActive"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                {...field}
                                                checked={field.value}
                                                defaultChecked={false}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                            />
                                        )}
                                    />
                                }
                                label="Est actif ?"
                            />
                        </div>
                    </fieldset>
                    <button type="submit" className="btn btn-success">
                        {isSubmitting && (
                            <div className="spinner-border spinner-border-sm mx-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        )}
                        Submit
                    </button>
                    {/* {!!contribution?.id && (
                        <button type="button" className="btn btn-danger" onClick={onDeleteAction}>
                            {isSubmitting && (
                                <div className="spinner-border spinner-border-sm mx-2" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            )}
                            Delete
                        </button>
                    )} */}
                </form>
            </LocalizationProvider>
        </div>
    );
}
