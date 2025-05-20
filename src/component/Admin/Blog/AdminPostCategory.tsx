import {
    createPostCategory,
    deletePostCategory,
    getPostCategory,
    updatePostCategory,
} from '@/administration/services/postCategoryAdmin.service';
import { useAuth } from '@/contexts/AuthContext';
import { PostCategoryFormData } from '@/types/PostCategory';
import { t } from 'i18next';
import { useState, useCallback, useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale/fr';
import { TextField } from '@mui/material';
import { TranslationData } from '@/types/Translation';

const defaultTranslations: TranslationData[] = [
    { languageCode: 'en', title: '' },
    { languageCode: 'fr', title: '' },
];

export default function AdminPostCategory() {
    const navigate = useNavigate();
    const { token, setToken } = useAuth();
    const { id } = useParams();
    const [postCategory, setPostCategory] = useState<PostCategoryFormData>();
    const [isInitializing, setIsInitializing] = useState<boolean>(false);
    const { register, handleSubmit, formState, control, setValue } = useForm<PostCategoryFormData>({
        mode: 'onTouched',
        defaultValues: {
            translations: defaultTranslations,
            createdAt: new Date(),
        },
    });
    const { isSubmitting, isDirty, isValid } = formState;

    const { fields } = useFieldArray({
        control,
        name: 'translations',
    });

    const initPostCategory = useCallback(async () => {
        if (id) {
            try {
                const u = await getPostCategory(Number(id), token!, setToken);
                console.info('json PostCategory u:', u);

                setPostCategory(u);
                setValue('id', u.id);
                setValue('createdAt', new Date(u.createdAt));
                setValue('updatedAt', u.updatedAt ? new Date(u.updatedAt) : undefined);
                setValue('translations', u.translations);
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

    const onSubmit = async (data: PostCategoryFormData) => {
        if (isDirty && isValid) {
            try {
                if (data?.id) {
                    await updatePostCategory(data?.id, token!, data, setToken);
                    toast.success(t('register.update'));
                } else {
                    await createPostCategory(token!, data, setToken);
                    toast.success(t('register.create'));
                }
                navigate('/admin/category');
            } catch {
                toast.error(t('register.error'));
            }
        }
    };

    const onDeleteAction = async () => {
        const confirmDelete = window.confirm('Es-tu sûr de vouloir supprimer cet élément ?');

        if (confirmDelete) {
            try {
                await deletePostCategory(postCategory!.id!, token!, setToken);
                toast.success('Paramètre supprimé avec succès!');
                navigate('/admin/category', { replace: true });
            } catch (error) {
                console.error('Erreur lors de la suppression :', error);
                toast.error('Échec de la suppression. Veuillez réessayer.');
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
                        <legend>Category</legend>
                        {fields.map((field, index) => (
                            <div key={field.id} className="col-lg-2 col-md-3 col-sm-12 mb-3">
                                <TextField
                                    type="text"
                                    className="form-control"
                                    id={`title-${index}`}
                                    label={`Title (${field.languageCode.toUpperCase()})`}
                                    {...register(`translations.${index}.title`)}
                                    placeholder={`Titre pour la langue ${field.languageCode}`}
                                    required
                                />
                            </div>
                        ))}
                        <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                            <Controller
                                name="createdAt"
                                control={control}
                                render={({ field }) => (
                                    <DateTimePicker
                                        label="Créer le"
                                        className="form-control"
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
                                        className="form-control"
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
