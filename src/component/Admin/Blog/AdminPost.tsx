import { useAuth } from '@/contexts/AuthContext';
import * as PostAdminServices from '@/administration/services/postAdmin.service';
import * as PostCategoryAdminServices from '@/administration/services/postCategoryAdmin.service';
import { Post, PostFormData } from '@/types/Post';
import { t } from 'i18next';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { fr } from 'date-fns/locale/fr';
import Quill from 'quill';
import Editor from '@/hook/Editor';
import { PostCategory } from '@/types/PostCategory';
import { tokenDecoded } from '@/services/token.services';
import UploadImage from '@/component/Form/UploadImage';
import { UploadFile } from '@/types/UploadFile';

export default function AdminPost() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const { id } = useParams();
    const [post, setPost] = useState<Post>();
    const [isInitializing, setIsInitializing] = useState<boolean>(false);
    const quillRef = useRef<Quill | null>(null);
    const [postCategories, setPostCategories] = useState<Array<PostCategory>>([]);

    const { register, handleSubmit, formState, control, setValue } = useForm<PostFormData>({
        mode: 'onTouched',
    });
    const { isSubmitting, errors, isDirty, isValid } = formState;

    const initPost = useCallback(
        async (post: Post) => {
            setPost(post);
            setValue('createdAt', new Date(post.createdAt));
            setValue('updatedAt', post.updatedAt ? new Date(post.updatedAt) : undefined);
            setValue('publishedAt', post.publishedAt ? new Date(post.publishedAt) : undefined);
            setValue(
                'categories',
                post.categories?.map((cat) => cat.id),
            );
            setValue('content', post.content);
            setValue('isPublish', post.isPublish);
            setValue('id', post.id);
            setValue('image', post.image);
        },
        [setValue],
    );

    const getPostCategories = useCallback(async () => {
        if (postCategories.length === 0) {
            try {
                const categories = await PostCategoryAdminServices.getPostCategories(token!);
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
                const p: Post = await PostAdminServices.getPost(Number(id), token!);
                initPost(p);
            } catch (e) {
                toast.error(`Erreur lors du chargement de l'article`);
                console.log('ERROR: init Post', e);
            }
        }
    }, [id, token, initPost]);

    const initForm = useCallback(async () => {
        try {
            await getPostCategories();
            await getPost();
        } catch (e) {
            toast.error(`Erreur lors de l'initialisation du formulaire`);
            console.log('ERROR: init Post', e);
        } finally {
            setIsInitializing(true);
        }
    }, [getPostCategories, getPost]);

    useEffect(() => {
        if (!isInitializing) {
            initForm();
        }
    }, [initForm, isInitializing]);

    const onSubmit = async (data: PostFormData) => {
        const selectedCategories = postCategories.filter((cat) => data.categories?.includes(cat.id));
        const sendData = { ...data, categories: selectedCategories };

        if (isDirty && isValid) {
            try {
                if (data.id) {
                    const updatedPost = await PostAdminServices.update(data.id, token!, sendData);
                    initPost(updatedPost);
                    toast.success(t('post.update'));
                } else {
                    const decodedToken = tokenDecoded(token!);
                    sendData.author = decodedToken.userId;
                    await PostAdminServices.create(token!, sendData);
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
                await PostAdminServices.destroy(post!.id, token!);
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
        post!.image64 = data.base64;
        setPost(post);
    };

    if (!isInitializing) {
        return <div>{t('common.loading')}</div>;
    }

    return (
        <div className="container-fluid">
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="row g-3">
                        <legend>Information sur l'article</legend>
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <TextField
                                type="text"
                                id="title"
                                label="Titre"
                                className="form-control"
                                {...register('title', {
                                    value: post?.title,
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
                                    render={({ field }) => (
                                        <FormControl className="form-control">
                                            <InputLabel id="categories">Catégories</InputLabel>
                                            <Select
                                                labelId="categories"
                                                multiple
                                                value={field.value || []}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                input={<OutlinedInput label="Categories" />}
                                            >
                                                {postCategories.map((cat) => (
                                                    <MenuItem key={cat.id} value={cat.id}>
                                                        {cat.title}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </div>
                        </div>
                        <UploadImage onUpload={handleImageUpload} />
                        <label>
                            Si vous uploadez un fichier, il faut également enregistrer le formulaire sinon il ne sera
                            pas pris en considération
                        </label>
                        {post?.image64 && (
                            <img src={post.image64} alt="Uploaded" style={{ width: '856px', height: '419px' }} />
                        )}
                    </fieldset>

                    <fieldset className="row g-3">
                        <legend>Contenu de l'article</legend>
                        <div className="col-6 mb-3">
                            <Controller
                                name="content"
                                control={control}
                                render={({ field }) => (
                                    <Editor
                                        ref={quillRef}
                                        readOnly={false}
                                        defaultValue={field.value}
                                        onTextChange={() => {
                                            const childNode = quillRef.current?.container.firstChild;
                                            const textContent = childNode?.textContent;
                                            let innerHTML = '';
                                            if (childNode instanceof HTMLElement) innerHTML = childNode?.innerHTML;
                                            if (!textContent) innerHTML = '';

                                            field.onChange(innerHTML);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        {/* <div className="card col-6 mb-3">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: quillRef?.current?.container?.firstChild?.innerHTML ?? 'DEFAULT',
                                }}
                            ></div>
                        </div> */}
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
