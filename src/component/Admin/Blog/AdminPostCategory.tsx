import {
    createPostCategory,
    deletePostCategory,
    getPostCategory,
    updatePostCategory,
} from '@/administration/services/postCategoryAdmin.service';
import { useAuth } from '@/contexts/AuthContext';
import { PostCategory } from '@/types/PostCategory';
import { t } from 'i18next';
import { useState, useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { fr } from 'date-fns/locale/fr';
import { TextField } from '@mui/material';

export default function AdminPostCategory() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const { id } = useParams();
    const [postCategory, setPostCategory] = useState<PostCategory>();
    const [isInitializing, setIsInitializing] = useState<boolean>(false);
    const { register, handleSubmit, formState, control, setValue } = useForm<PostCategory>({
        mode: 'onTouched',
        values: postCategory,
    });
    const { isSubmitting, errors, isDirty, isValid } = formState;

    const initPostCategory = useCallback(async () => {
        if (id) {
            try {
                const u = await getPostCategory(Number(id), token!);
                setPostCategory(u);
                setValue('createdAt', new Date(u.createdAt));
                setValue('updatedAt', new Date(u.updatedAt));
            } catch (e) {
                toast.error(`Erreur lors du chargement de la catégorie`);
                console.log('ERROR: init PostCategory', e);
            } finally {
                setIsInitializing(true);
            }
        } else {
            setIsInitializing(true);
        }
    }, [id, token]);

    useEffect(() => {
        initPostCategory();
    }, [initPostCategory]);

    const onSubmit = async (data: PostCategory) => {
        if (isDirty && isValid) {
            try {
                if (data.id) {
                    await updatePostCategory(data.id, token!, data);
                    toast.success(t('register.update'));
                    navigate('/admin/category');
                } else {
                    await createPostCategory(token!, data);
                    toast.success(t('register.create'));
                    navigate('/admin/category');
                }
            } catch {
                toast.error(t('register.error'));
            }
        }
    };

    const onDeleteAction = async () => {
        const confirmDelete = window.confirm('Es-tu sûr de vouloir supprimer cet élément ?');

        if (confirmDelete) {
            try {
                await deletePostCategory(postCategory!.id, token!);
                toast.success('Paramètre supprimé avec succès!');
                navigate('/admin/category', { replace: true });
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
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset key={1} className="row g-3">
                        <legend>Parameter</legend>
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <TextField
                                type="text"
                                id="title"
                                label="Titre"
                                className="form-control"
                                {...register('title', {
                                    value: postCategory?.title,
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
                                    />
                                )}
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
                    {!!postCategory?.id && (
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
            </LocalizationProvider>
        </div>
    );
}
