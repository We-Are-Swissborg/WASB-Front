import { useAuth } from '@/contexts/AuthContext';
import { Membership } from '@/types/Membership';
import { TextareaAutosize, TextField } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { fr } from 'date-fns/locale';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as MembershipService from '@/administration/services/membershipAdmin.service';

export default function AdminMembership() {
    const { t } = useTranslation('global');
    const { token } = useAuth();
    const { id } = useParams();
    const [membership, setMembership] = useState<Membership>();
    const [isInitializing, setIsInitializing] = useState<boolean>(false);

    const initMembership = useCallback(async (membership: Membership) => {
        setMembership(membership);
    }, []);

    const getMembership = useCallback(async () => {
        if (id && token) {
            try {
                const membership = await MembershipService.getMembership(Number(id), token);
                initMembership(membership);
            } catch (error) {
                toast.error('Erreur lors du chargement de la contribution');
                console.error(error);
            }
        }
    }, [token, id, initMembership]);

    const initForm = useCallback(async () => {
        try {
            await getMembership();
        } catch (e) {
            toast.error(`Erreur lors de l'initialisation du formulaire`);
            console.log('ERROR: init Form Contribution', e);
        } finally {
            setIsInitializing(true);
        }
    }, [getMembership]);

    useEffect(() => {
        if (!isInitializing) {
            initForm();
        }
    }, [initForm, isInitializing]);

    const onSubmit = async (id: number, status: 'in progress' | 'accepted' | 'not accepted') => {
        try {
            if (membership && token) {
                membership.contributionStatus = status;
                await MembershipService.changeStatusMembership(id, membership, token);
                toast.success(t('membership.update'));
                // navigate('/admin/memberships');
            }
        } catch {
            toast.error(t('membership.error'));
        }
    };

    if (!isInitializing) {
        return <div>{t('common.loading')}</div>;
    }

    const handleAccept = () => onSubmit(membership!.id, 'accepted');
    const handleReject = () => onSubmit(membership!.id, 'not accepted');
    const handlePending = () => onSubmit(membership!.id, 'in progress');

    return (
        <div className="container-fluid">
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                {membership && (
                    <>
                        <fieldset className="row g-3">
                            <legend>Contribution</legend>
                            <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                                <TextField
                                    type="text"
                                    id="username"
                                    label="Username"
                                    className="form-control"
                                    value={membership?.user.username}
                                    disabled
                                />
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                                <DateTimePicker
                                    label="Date Request"
                                    value={new Date(membership.createdAt)}
                                    disabled
                                    sx={{ width: '100%' }}
                                />
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                                <DateTimePicker
                                    label="Mise à jour le"
                                    value={membership.updatedAt ? new Date(membership.updatedAt) : undefined}
                                    disabled
                                    sx={{ width: '100%' }}
                                />
                            </div>
                        </fieldset>
                        <fieldset className="row g-3">
                            <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                                <TextField
                                    type="text"
                                    id="contribution"
                                    label="Contribution"
                                    className="form-control"
                                    value={membership.contribution.title}
                                    disabled
                                />
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                                <TextField
                                    type="text"
                                    id="contributionStatus"
                                    label="Statut"
                                    className="form-control"
                                    value={membership.contributionStatus}
                                    disabled
                                />
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                                <DateTimePicker
                                    label="Date de début"
                                    value={
                                        membership.dateContribution ? new Date(membership.dateContribution) : undefined
                                    }
                                    disabled
                                    sx={{ width: '100%' }}
                                />
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                                <DateTimePicker
                                    label="Date de fin"
                                    value={
                                        membership.endDateContribution
                                            ? new Date(membership.endDateContribution)
                                            : undefined
                                    }
                                    disabled
                                    sx={{ width: '100%' }}
                                />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                <TextareaAutosize
                                    minRows={2}
                                    maxRows={8}
                                    id="note"
                                    className="form-control"
                                    value={membership.note}
                                    onChange={(e) => setMembership({ ...membership, note: e.target.value })}
                                />
                            </div>
                        </fieldset>
                        <div className="btn-group">
                            <button className="btn btn-warning" onClick={handlePending}>
                                {/* {isSubmitting && (
                                    <div className="spinner-border spinner-border-sm mx-2" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                )} */}
                                En attente
                            </button>
                            <button className="btn btn-success" onClick={handleAccept}>
                                {/* {isSubmitting && (
                                    <div className="spinner-border spinner-border-sm mx-2" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                )} */}
                                Valider
                            </button>
                            <button className="btn btn-danger" onClick={handleReject}>
                                {/* {isSubmitting && (
                                    <div className="spinner-border spinner-border-sm mx-2" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                )} */}
                                Rejeter
                            </button>
                        </div>
                    </>
                )}
            </LocalizationProvider>
        </div>
    );
}
