
import { useAuth } from '@/contexts/AuthContext';
import { getPost } from '@/services/blog.service';
import { Post } from '@/types/Post';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AdminPost() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const { id } = useParams();
    const [post, setPost] = useState<Post>();
    const [isInitializing, setIsInitializing] = useState<boolean>(false);
    const { register, handleSubmit, formState } = useForm<Post>({
        mode: 'onTouched',
        values: post,
    });
    const { isSubmitting, errors, isDirty, isValid } = formState;

    const initPost = useCallback(async () => {
        if (id) {
            try {
                const u = await getPost(Number(id), token!);
                setPost(u);
            } catch (e) {
                toast.error(`Erreur lors du chargement de l'article`);
                console.log('ERROR: init Post', e);
            } finally {
                setIsInitializing(true);
            }
        } else {
            setIsInitializing(true);
        }
    }, [id, token]);

    useEffect(() => {
        initPost();
    }, [initPost]);

    const onSubmit = async (data: Post) => {
        if (isDirty && isValid) {
            // try {
            //     if (data.id) {
            //         await updateParameter(data.id, token!, data);
            //         toast.success(t('register.update'));
            //         navigate('/admin/settings');
            //     } else {
            //         await createParameter(token!, data);
            //         toast.success(t('register.create'));
            //         navigate('/admin/settings');
            //     }
            // } catch {
            //     toast.error(t('register.error'));
            // }
        }
    };

    const onDeleteAction = async () => {
        const confirmDelete = window.confirm('Es-tu sûr de vouloir supprimer cet élément ?');

        if (confirmDelete) {
            // try {
            //     await deleteParameter(parameter!.id, token!);
            //     toast.success('Paramètre supprimé avec succès!');
            //     navigate('/admin/settings', { replace: true });
            // } catch (error) {
            //     console.error('Erreur lors de la suppression :', error);
            //     toast.error('Échec de la suppression. Veuillez réessayer.');
            // }
        }
    };

    if (!isInitializing) {
        return <div>Loading</div>;
    }

    return (
        <div className="container-fluid">
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset key={1} className="row g-3">
                    <legend>Article</legend>
                    
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
        </div>
    );
}
