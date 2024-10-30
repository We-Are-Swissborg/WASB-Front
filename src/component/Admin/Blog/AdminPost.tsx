
import { useAuth } from '@/contexts/AuthContext';
import * as PostAdminServices from '@/administration/services/postAdmin.service';
import { Post } from '@/types/Post';
import { t } from 'i18next';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { fr } from 'date-fns/locale/fr';
import Quill from 'quill';
import Editor from '@/hook/Editor';

export default function AdminPost() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const { id } = useParams();
    const [post, setPost] = useState<Post>();
    const [isInitializing, setIsInitializing] = useState<boolean>(false);
    const quillRef = useRef<Quill | null>(null);

    const { register, handleSubmit, formState, control, setValue, reset } = useForm<Post>({
        mode: 'onTouched',
        defaultValues: post,
    });
    const { isSubmitting, errors, isDirty, isValid } = formState;

    const initPost  = async(post: Post) => {        
        setPost(post);
        reset(post);
        setValue('createdAt', new Date(post.createdAt));
        setValue('updatedAt', new Date(post.updatedAt));
        setValue('publishedAt', new Date(post.publishedAt ?? 0));
    };

    const getPost = useCallback(async () => {
        if (id) {
            try {
                const u = await PostAdminServices.getPost(Number(id), token!);
                initPost(u);
            } catch (e) {
                toast.error(`Erreur lors du chargement de l'article`);
                console.log('ERROR: init Post', e);
            } finally {
                setIsInitializing(true);
            }
        } else {
            setIsInitializing(true);
        }
    }, [id, token, reset]);

    useEffect(() => {
        getPost();
    }, [getPost]);

    const onSubmit = async (data: Post) => {
        console.log('onSubmit', isDirty, isValid);

        if (isDirty && isValid) {
            try {
                if (data.id) {
                    const updatedPost =await PostAdminServices.update(data.id, token!, data);
                    initPost(updatedPost);
                    toast.success(t('post.update'));
                    // navigate('/admin/posts');
                } else {
                    await PostAdminServices.create(token!, data);
                    toast.success(t('post.create'));
                    // navigate('/admin/posts');
                }
            } catch(e) {
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

    if (!isInitializing) {
        return <div>Loading</div>;
    }

    return (
        <div className="container-fluid">
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset key={1} className="row g-3">
                        <legend>Article</legend>
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
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
                            <><div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                                <Controller
                                    name="createdAt"
                                    control={control}
                                    render={({ field }) => (
                                        <DateTimePicker
                                            label="Créer le"
                                            slotProps={(props) => <TextField {...props} fullWidth />}
                                            value={field?.value}
                                            onChange={(newValue) => field.onChange(newValue)}
                                            disabled />
                                    )} />
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-12 mb-3">
                                <Controller
                                    name="updatedAt"
                                    control={control}
                                    render={({ field }) => (
                                        <DateTimePicker
                                            label="Mise à jour le"
                                            slotProps={(props) => <TextField {...props} fullWidth />}
                                            value={field?.value}
                                            onChange={(newValue) => field.onChange(newValue)}
                                            disabled />
                                    )} />
                            </div>
                            </>
                        )}
                    </fieldset>
                    <fieldset className="row g-3">
                        <div className="col-lg-1 col-md-2 col-sm-2 mb-3">
                            <FormControlLabel
                                control={
                                    <Controller
                                        name='isPublish'
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                {...field}
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                            />
                                        )}
                                    />}
                                label="Publié ?"                           
                            />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <Controller
                                name="publishedAt"
                                control={control}
                                render={({ field }) => (
                                    <DateTimePicker
                                        label="Publié le"
                                        slotProps={(props) => <TextField {...props} fullWidth />}
                                        value={field.value}
                                        onChange={(newValue) => field.onChange(newValue)}
                                        disabled />
                                )}
                            />
                        </div>
                    </fieldset>
                    <fieldset className="row g-3">
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
                                )} />
                        </div>
                        {/* <div className="col-6 mb-3" >
                            <div dangerouslySetInnerHTML={{ __html: quillRef?.current?.container?.firstChild?.innerHTML ?? 'DEFAULT' }}></div>                            
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
