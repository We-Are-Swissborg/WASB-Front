import {
    createParameter,
    deleteParameter,
    getParameter,
    updateParameter,
} from '@/administration/services/parameterAdmin.service';
import { UseAuth } from '@/contexts/AuthContext';
import { Parameter } from '@/types/Parameter';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AdminSetting() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { token, setToken } = UseAuth();
    const { id } = useParams();
    const [parameter, setParameter] = useState<Parameter>();
    const [isInitializing, setIsInitializing] = useState<boolean>(false);
    const { register, handleSubmit, formState, control } = useForm<Parameter>({
        mode: 'onTouched',
        values: parameter,
    });
    const { isSubmitting, errors, isDirty, isValid } = formState;

    const initParameter = useCallback(async () => {
        if (id) {
            try {
                const u = await getParameter(Number(id), token!, setToken);
                setParameter(u);
            } catch (e) {
                toast.error(`Erreur lors du chargement du paramètre`);
                console.log('ERROR: init Parameter', e);
            } finally {
                setIsInitializing(true);
            }
        } else {
            setIsInitializing(true);
        }
    }, [id, token]);

    useEffect(() => {
        initParameter();
    }, [initParameter]);

    const onSubmit = async (data: Parameter) => {
        if (isDirty && isValid) {
            try {
                if (data.id) {
                    await updateParameter(data.id, token!, data, setToken);
                    toast.success(t('register.update'));
                } else {
                    await createParameter(token!, data, setToken);
                    toast.success(t('register.create'));
                }
                navigate('/admin/settings');
            } catch {
                toast.error(t('register.error'));
            }
        }
    };

    const onDeleteAction = async () => {
        const confirmDelete = window.confirm('Es-tu sûr de vouloir supprimer cet élément ?');

        if (confirmDelete) {
            try {
                await deleteParameter(parameter!.id, token!, setToken);
                toast.success('Paramètre supprimé avec succès!');
                navigate('/admin/settings', { replace: true });
            } catch (error) {
                console.error('Erreur lors de la suppression :', error);
                toast.error('Échec de la suppression. Veuillez réessayer.');
            }
        }
    };

    if (!isInitializing) {
        return <div>Loading</div>;
    }

    return (
        <div className="container-fluid">
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="row g-3">
                    <legend>Parameter</legend>
                    <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                        <TextField
                            type="text"
                            id="code"
                            label="Code"
                            className="form-control"
                            {...register('code', {
                                value: parameter?.name,
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
                        {errors?.code && <div className="text-danger">{errors.code.message}</div>}
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                        <TextField
                            type="text"
                            id="name"
                            label="Name"
                            className="form-control"
                            {...register('name', {
                                value: parameter?.name,
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
                        {errors?.name && <div className="text-danger">{errors.name.message}</div>}
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                        <TextField
                            type="text"
                            id="value"
                            label="Value"
                            className="form-control"
                            {...register('value', {
                                required: 'this is a required',
                            })}
                            required
                        />
                        {errors?.value && <div className="text-danger">{errors.value.message}</div>}
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
                {!!parameter?.id && (
                    <button type="button" className="btn btn-danger" onClick={onDeleteAction}>
                        {isSubmitting && (
                            <div className="spinner-border spinner-border-sm mx-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        )}
                        Delete
                    </button>
                )}
            </form>
        </div>
    );
}
