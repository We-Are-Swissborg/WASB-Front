import { UseAuth } from '@/contexts/AuthContext';
import * as PostAdminServices from '@/administration/services/postAdmin.service';
import * as PostCategoryAdminServices from '@/administration/services/postCategoryAdmin.service';
import { PostFormData, PostFormState } from '@/types/Post';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale/fr';
import { PostCategoryFormData } from '@/types/PostCategory';
import { tokenDecoded } from '@/services/token.services';
import UploadImage from '@/component/Form/UploadImage';
import { UploadFile } from '@/types/UploadFile';
import { TranslationData } from '@/types/Translation';
import TranslationField from '../Translation/TranslationField';
import TranslationEditor from '../Translation/TranslationEditor';

const defaultTranslations: TranslationData[] = [
    { languageCode: 'en', title: '', content: '' },
    { languageCode: 'fr', title: '', content: '' },
];

export default function AdminPost() {
    const navigate = useNavigate();
    const { token, setToken } = UseAuth();
    const { id } = useParams();
    const [post, setPost] = useState<PostFormData>();
    const [isInitializing, setIsInitializing] = useState<boolean>(false);
    const [postCategories, setPostCategories] = useState<Array<PostCategoryFormData>>([]);
    const [previewImage64, setPreviewImage64] = useState<string | undefined>();

    const { register, handleSubmit, formState, control, setValue } = useForm<PostFormData>({
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

    const initPost = useCallback(
        async (post: PostFormState) => {
            setPost(post);
            setValue('createdAt', new Date(post.createdAt));
            setValue('updatedAt', post.updatedAt ? new Date(post.updatedAt) : undefined);
            setValue('publishedAt', post.publishedAt ? new Date(post.publishedAt) : undefined);
            setValue('categories', post.categories);
            setValue('isPublish', post.isPublish);
            setValue('id', post.id);
            setValue('image', post.image);
            setValue('translations', post.translations);
            setPreviewImage64(post.image64);
        },
        [setValue],
    );

    const getPostCategories = useCallback(async () => {
        if (postCategories.length === 0) {
            try {
                const categories = await PostCategoryAdminServices.getPostCategories(token!, setToken);
                setPostCategories(categories);
            } catch (error) {
                toast.error('Erreur lors du chargement des catégories');
                console.error(error);
            }
        }
    }, [token, postCategories]);

    const getPost = useCallback(async () => {
        if (id && !post) {
            try {
                const p: PostFormData = await PostAdminServices.getPost(Number(id), token!, setToken);
                initPost(p);
            } catch (e) {
                toast.error(`Erreur lors du chargement de l'article`);
                console.error('ERROR: init Post', e);
            }
        }
    }, [id, token, initPost]);

    const initForm = useCallback(async () => {
        try {
            await getPostCategories();
            await getPost();
        } catch (e) {
            toast.error(`Erreur lors de l'initialisation du formulaire`);
            console.error('ERROR: init Post', e);
        } finally {
            setIsInitializing(true);
        }
    }, [getPostCategories, getPost]);

    useEffect(() => {
        if (!isInitializing) {
            initForm();
        }
    }, []);

    const onSubmit = async (data: PostFormData) => {
        const sendData = { ...data };

        if (isDirty && isValid) {
            try {
                if (data.id) {
                    const updatedPost = await PostAdminServices.update(data.id, token!, sendData, setToken);
                    initPost(updatedPost);
                    toast.success(t('post.update'));
                } else {
                    const decodedToken = tokenDecoded(token!);
                    sendData.author = decodedToken.userId;
                    await PostAdminServices.create(token!, sendData, setToken);
                    toast.success(t('post.create'));
                }
            } catch (e) {
                toast.error(t('register.error'));
                console.error(e);
            }
        }
    };

    const onDeleteAction = async () => {
        const confirmDelete = window.confirm('Es-tu sûr de vouloir supprimer cet élément ?');

        if (confirmDelete) {
            try {
                await PostAdminServices.destroy(post!.id!, token!, setToken);
                toast.success('Article supprimé avec succès!');
                navigate('/admin/posts', { replace: true });
            } catch (error) {
                console.error('Erreur lors de la suppression :', error);
                toast.error('Échec de la suppression. Veuillez réessayer.');
            }
        }
    };

    const handleImageUpload = async (data: UploadFile) => {
        setValue('image', data.filePath);
        setPreviewImage64(data.base64);
    };

    if (!isInitializing) {
        return <div>{t('common.loading')}</div>;
    }

    const getTranslatedTitle = (translations: TranslationData[], language: string): string => {
        return translations.find((t) => t.languageCode === language)?.title || translations[0]?.title || 'Sans titre';
    };

    return (
        <div className="container-fluid">
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="row g-3">
                        <legend>Information sur l'article</legend>
                        {!!post?.createdAt && (
                            <>
                                <div className="col-lg-2 col-md-4 col-sm-12">
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
                                <div className="col-lg-2 col-md-4 col-sm-12">
                                    <Controller
                                        name="updatedAt"
                                        control={control}
                                        render={({ field }) => (
                                            <DateTimePicker
                                                label="Mise à jour le"
                                                className="form-control"
                                                value={field?.value}
                                                onChange={(newValue) => field.onChange(newValue)}
                                                disabled={true}
                                            />
                                        )}
                                    />
                                </div>
                            </>
                        )}
                        <div className="row g-3">
                            <div className="col-lg-2 col-md-2 col-sm-2 mb-3">
                                <FormControlLabel
                                    className="form-check"
                                    control={
                                        <Controller
                                            name="isPublish"
                                            control={control}
                                            render={({ field }) => (
                                                <Checkbox
                                                    {...field}
                                                    checked={field.value}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                />
                                            )}
                                        />
                                    }
                                    label="Publié ?"
                                />
                            </div>
                            <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
                                <Controller
                                    name="publishedAt"
                                    control={control}
                                    render={({ field }) => (
                                        <DateTimePicker
                                            label="Publié le"
                                            className="form-control"
                                            value={field.value}
                                            onChange={(newValue) => field.onChange(newValue)}
                                            disabled
                                        />
                                    )}
                                />
                            </div>
                            <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
                                <Controller
                                    name="categories"
                                    control={control}
                                    render={({ field }) => {
                                        const selectedValues = Array.isArray(field.value)
                                        ? field.value.map((cat) => cat.id)
                                        : [];

                                        return (
                                            <FormControl className="form-control">
                                            <InputLabel id="categories">Catégories</InputLabel>
                                            <Select
                                                labelId="categories"
                                                multiple
                                                value={selectedValues}
                                                onChange={(event) => {
                                                    const selectedIds = event.target.value as number[];
                                                    const selectedCategories = postCategories.filter((cat) =>
                                                        selectedIds.includes(cat.id ?? 0),
                                                    );
                                                    field.onChange(selectedCategories);
                                                }}
                                                input={<OutlinedInput label="Categories" />}
                                                renderValue={(selected) =>
                                                    postCategories
                                                        .filter((cat) => selected.includes(cat.id))
                                                        .map((cat) => getTranslatedTitle(cat.translations, 'fr'))
                                                        .join(', ')
                                                }
                                            >
                                                {postCategories.map((category) => (
                                                    <MenuItem key={category.id} value={category.id}>
                                                        <Checkbox
                                                            checked={
                                                                selectedValues.includes(category.id)
                                                            }
                                                        />
                                                        <ListItemText
                                                            primary={getTranslatedTitle(category.translations, 'fr')}
                                                        />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                }
                                />
                            </div>
                        </div>
                        <UploadImage onUpload={handleImageUpload} />
                        <label>
                            Si vous uploadez un fichier, il faut également enregistrer le formulaire sinon il ne sera
                            pas pris en considération
                        </label>
                        {previewImage64 && (
                            <img src={previewImage64} alt="Uploaded" style={{ width: '856px', height: '419px' }} />
                        )}
                    </fieldset>

                    <fieldset className="row g-3">
                        <legend>Contenu de l'article</legend>
                        {fields.map((field, index) => (
                            <div key={field.id} className="col-12 mb-4">
                                <TranslationField index={index} languageCode={field.languageCode} register={register} />
                                <TranslationEditor control={control} index={index} languageCode={field.languageCode} />
                            </div>
                        ))}
                    </fieldset>

                    <button type="submit" className="btn btn-success">
                        {isSubmitting && (
                            <div className="spinner-border spinner-border-sm mx-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        )}
                        Submit
                    </button>
                    {!!post?.id && (
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
