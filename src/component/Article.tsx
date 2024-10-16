import { ChangeEvent, useEffect, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updatePost, deletePost, getPost, previewPost } from '../services/blog.service';
import { useParams, useNavigate, useBeforeUnload } from 'react-router-dom';
import { Post } from '../types/Post';
import arrayBufferToBase64 from '../services/arrayBufferToBase64';
import { useAuth } from '../contexts/AuthContext';
import { tokenDecoded } from '../services/token.services';
import Modal from '../common/Modal';
import { toast } from 'react-toastify';
import { FieldValues, useForm } from 'react-hook-form';
import Quill from 'quill';
import Editor from '../hook/Editor';
import { Delta, EmitterSource } from 'quill/core';
import '../css/Blog.css';

export default function Article() {
    const { t } = useTranslation('global');
    const [post, setPost] = useState<Post>();
    const { idPost } = useParams();
    const [init, setInit] = useState(true);
    const { token } = useAuth();
    const [author, setAuthor] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState('init');
    const [deleteArticle, setDeleteArticle] = useState('init');
    const [edit, setEdit] = useState(false);
    const navigate = useNavigate();
    const [image, setImage] = useState<string | ArrayBuffer | undefined | null>(null);
    const { register, handleSubmit, setValue, getValues } = useForm();
    const [previewValues, setPreviewValues] = useState<FieldValues>();
    const [isForm, setIsForm] = useState<boolean>(true);
    const quillRef = useRef<Quill | null>(null);
    const isBuffer = typeof image !== 'string'; // Required for check if the image has changed.
    const [disabledSubmit, setDisabledSubmit] = useState(true);
    const [abandonEditArticle, setAbandonEditArticle] = useState('init');
    const [continueArticle, setContinueArticle] = useState('init');
    const [editModal, setEditModal] = useState('init');
    const [deleteModal, setDeleteModal] = useState('init');
    const optionDate: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const isOldEqualNewValue = () =>
        getValues().title === post?.title &&
        getValues().image?.toString() === post?.image?.toString() &&
        getValues().content === post?.content;

    const onSubmit = handleSubmit((user, e) => {
        const nameTarget = e?.target.name;
        const propsForm = Object.keys(user);
        const lengthEditor = quillRef.current?.getLength();

        propsForm.forEach((prop) => {
            const isEmptyValues = user[prop] === '' || user[prop] === undefined;
            if (isEmptyValues) {
                toast.error(t(`post-form.${prop}-empty`));
                throw new Error(prop + ' is empty');
            }

            if (user.title.length < 5) {
                toast.error(t('post-form.title-length'));
                throw new Error('ERROR: Title length too short.');
            }
            if (lengthEditor! < 250) {
                toast.error(t('post-form.editor-length'));
                throw new Error('ERROR: Editor length too short.');
            }
        });

        // Display post before save post to BD
        if (nameTarget === 'preview') {
            const isTheSame = user.content === post?.content;

            if (isBuffer) user.image = image;
            if (token && (!isTheSame || !isBuffer)) {
                const formData = new FormData();

                if (!isTheSame) formData.append('contentPost', user.content);
                if (!isBuffer) formData.append('imagePost', user.image);

                previewPost(token, formData).then((res) => {
                    if (res.clean) user.content = res.clean;
                    if (res.convertToWebp) {
                        user.image = res.convertToWebp;
                        setImage(res.convertToWebp);
                    }
                    setIsForm(false);
                    setPreviewValues(user);
                });
            } else {
                setIsForm(false);
                setPreviewValues(user);
            }
        } else {
            const idLocal = JSON.parse(localStorage.getItem('resumeEditArticle') as string)?.id;

            if(token && previewValues && post?.id) {
                const goodId = idLocal ? Number(idLocal.split('-')[1]) : post.id;

                updatePost(goodId, previewValues, token).then(() => {
                    toast.success(t('article.post-update'));
                    setEdit(false);
                    setInit(true);
                    setIsForm(true);
                    localStorage.removeItem('resumeEditArticle');
                }).catch(() => {
                    toast.error(t('article.error-post-update'));
                });
            }
        }
    });

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const nameTarget = e.target?.name;
        const initImage = post?.image as unknown as ArrayBuffer;

        if (nameTarget === 'image') {
            const file = e.target?.files && e.target?.files[0];
            const fileReader = new FileReader();

            fileReader.onload = (event) => {
                // The file's text will be printed here.
                setImage(event.target?.result);
            };

            if (file) fileReader.readAsDataURL(file);
            else setImage(initImage);

            setValue('image', file ?? initImage);
        } else {
            const childNode = quillRef.current?.container.firstChild;
            const textContent = childNode?.textContent;
            let innerHTML = '';
            if (childNode instanceof HTMLElement) innerHTML = childNode?.innerHTML;
            if (!textContent) innerHTML = '';

            setValue('content', innerHTML);
        }
        setDisabledSubmit(isOldEqualNewValue());
    };

    const saveArticleLocalStorage = useCallback(() => {
        const isValue = Object.values(getValues()).find((value) => value?.length > 0);

        if(!Array.isArray(getValues().image)) setValue('image', ''); //Required else we can have an {}.
        else if(image) setValue('image', image);

        if(isForm && isValue) {
            const linkWithValues = {...getValues(), id: idPost};
            localStorage.setItem('resumeEditArticle', JSON.stringify(linkWithValues));
        } else if(!isForm && previewValues) {
            const previewWithLink = {...previewValues, id: idPost};
            localStorage.setItem('resumeEditArticle', JSON.stringify(previewWithLink));
        } else {
            localStorage.removeItem('resumeEditArticle');
        }
    }, [isForm, previewValues, image, getValues]);

    // If the user closes the page article is saved.
    useBeforeUnload(
        useCallback(() => {
            if(!isOldEqualNewValue()) {
                saveArticleLocalStorage();
            }
        }, [saveArticleLocalStorage])
    );

    const onChangeTexteArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const valueTarget = e.target?.value;
        setValue('title', valueTarget);

        setDisabledSubmit(isOldEqualNewValue());
    };

    const onEdit = () => {
        const id = JSON.parse(localStorage.getItem('resumeEditArticle') as string)?.id;

        if(localStorage.getItem('resumeEditArticle') && id !== idPost) {
            setEditModal('open');
        } else {
            editConfirm();
        }
    };

    const editConfirm = () => {
        const resumeEditArticle = JSON.parse(localStorage.getItem('resumeEditArticle') as string);
        setEdit(true);
        setValue('title', resumeEditArticle?.title ? resumeEditArticle.title : post?.title);
        setValue('image', resumeEditArticle?.image ? resumeEditArticle.image : post?.image);
        setValue('content', resumeEditArticle?.content ? resumeEditArticle.content : post?.content);
        setImage(resumeEditArticle?.image ? resumeEditArticle.image : post?.image as unknown as ArrayBuffer);
        setDisabledSubmit(isOldEqualNewValue());
    };

    const srcImageBeforePreview = () => {
        if (!isBuffer) return image;
        if (isBuffer)
            return arrayBufferToBase64(
                getValues().image.length > 0 ? getValues().image : previewValues?.image,
                'image/webp',
            );
    };

    const cancelEdit = () => {
        if(!isOldEqualNewValue()) {
            setOpenModal('open');
        } else {
            setEdit(false);
        }
    };

    const getArticle = (id: string) => {
        if(token) {
            const decodedToken = tokenDecoded(token);
            setAuthor(decodedToken.userId);
        }
        getPost(id).then((data) => {
            setPost(data);
            setInit(false);
        }).catch(() => {
            throw new Error('ERROR GET POST');
        });
    };

    useEffect(() => {
        if(idPost && init) getArticle(idPost);

        if(deleteArticle === 'confirm') {
            const id = idPost?.split('-')[1];
            deletePost(id!, token!).then(() => {
                toast.success(t('article.post-delete'));
                navigate('../');
            }).catch((e) => {
                toast.error(t('article.error-post-delete'));
                throw new Error('ERROR POST DELETE : ' + e);
            });
        }
        if(abandonEditArticle === 'confirm') {
            const id = JSON.parse(localStorage.getItem('resumeEditArticle') as string)?.id;
            localStorage.removeItem('resumeEditArticle');
            setAbandonEditArticle('init');
            setEdit(false);
            setOpenModal('init');
            if(id) getArticle(id);
        }
        if(continueArticle === 'confirm') {
            const id = JSON.parse(localStorage.getItem('resumeEditArticle') as string).id;
            setEditModal('init');
            setContinueArticle('init');
            editConfirm();
            navigate('../'+ id);
        }
        if(editModal === 'cancel') {
            localStorage.removeItem('resumeEditArticle');
            setEditModal('init');
            editConfirm();
        }

        return () => {
            if(!window.location.href.includes('blog/post-') && !isOldEqualNewValue() && edit) saveArticleLocalStorage();
        };
    }, [post, deleteArticle, init, abandonEditArticle, continueArticle, editModal, saveArticleLocalStorage]);

    return (
        <>
            <div className="container d-flex flex-column">
                {!edit ? (
                    <>
                        <div className="d-flex align-items-start justify-content-between mb-5 mt-3 container-title-article">
                            <h1
                                className="title-preview"
                                style={post?.author === author ? { marginRight: '35px' } : {}}
                            >
                                {post?.title}
                            </h1>
                            {post?.author === author && (
                                <div className="d-flex justify-content-between flex-column-reverse container-btn-article mt-3">
                                    <button
                                        className="btn btn-form align-self-end py-2 px-3 w-100 text-bg-danger delete-btn me-0"
                                        onClick={() => setDeleteModal('open')}
                                    >
                                        {t('article.delete')}
                                    </button>
                                    <button className="btn btn-form align-self-end py-2 px-3 w-100" onClick={onEdit}>
                                        {t('article.edit')}
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="container-main-image title-post overflow-hidden rounded-5 align-self-center mb-5">
                            <img
                                src={arrayBufferToBase64(post?.image as unknown as ArrayBuffer, 'image/webp')}
                                className="w-100 h-100 object-fit-cover"
                                alt="main image"
                            />
                        </div>
                        <div
                            dangerouslySetInnerHTML={{ __html: post?.content ?? 'DEFAULT' }}
                            className="content-post text-break"
                        />
                        <div className="d-flex justify-content-between mt-5 mb-3 container-about-post">
                            {post && (
                                <>
                                    <p>
                                        <span className="text-decoration-underline">{t('blog.created-by')}:</span>
                                        <strong> {post?.infoAuthor.username}</strong>
                                    </p>
                                    <p>
                                        <span className="text-decoration-underline">{t('blog.created-at')}:</span>{' '}
                                        {new Date(post?.createdAt).toLocaleDateString(
                                            `${t('blog.localCode')}`,
                                            optionDate,
                                        )}
                                    </p>
                                    <p>
                                        <span className="text-decoration-underline">{t('blog.last-update')}:</span>{' '}
                                        {new Date(post?.updatedAt).toLocaleDateString(
                                            `${t('blog.localCode')}`,
                                            optionDate,
                                        )}
                                    </p>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <form className="form align-items-start" onSubmit={onSubmit}>
                        <div
                            className="flex-column"
                            style={isForm ? { display: 'flex', width: '100%' } : { display: 'none' }}
                        >
                            <textarea
                                className="border border-0 border-bottom border-black h1 w-100 mb-5 mt-3"
                                {...register('title')}
                                id="title"
                                required={true}
                                onChange={onChangeTexteArea}
                                defaultValue={getValues()?.title}
                            />
                            <div className="container-main-image title-post overflow-hidden rounded-5 align-self-center">
                                <img
                                    src={srcImageBeforePreview()}
                                    className="w-100 h-100 object-fit-fill"
                                    alt="main image"
                                />
                            </div>
                            <div className="d-flex align-items-center mb-4">
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={onChange}
                                    style={getValues().image.name ? { width: 'initial' } : { width: '100px' }}
                                />
                                {!getValues().image.name && (
                                    <p className="m-0 ms-1 text-truncate overflow-hidden text-nowrap">{`image_${idPost}.webp`}</p>
                                )}
                            </div>
                            <Editor
                                ref={quillRef}
                                onTextChange={
                                    onChange as unknown as (
                                        delta: Delta,
                                        oldContents: Delta,
                                        source: EmitterSource,
                                    ) => unknown
                                }
                                readOnly={false}
                                defaultValue={getValues()?.content}
                            />
                            <div className="d-flex justify-content-end container-cancel-btn mt-5">
                                <button
                                    className="btn btn-form padding-button cancel-btn text-bg-danger"
                                    type="button"
                                    name="cancel"
                                    onClick={cancelEdit}
                                >
                                    {t('post-form.cancel')}
                                </button>
                                <button
                                    className="btn btn-form padding-button"
                                    type="submit"
                                    name="preview"
                                    onClick={onSubmit}
                                    disabled={disabledSubmit}
                                >
                                    {t('post-form.preview')}
                                </button>
                            </div>
                        </div>
                        <div
                            className="flex-column"
                            style={isForm ? { display: 'none' } : { display: 'flex', width: '100%' }}
                        >
                            <h1 className="title-preview mb-5 mt-3">{previewValues?.title}</h1>
                            <div className="container-main-image title-post overflow-hidden rounded-5 align-self-center mb-5">
                                <img
                                    src={arrayBufferToBase64(
                                        previewValues?.image as unknown as ArrayBuffer,
                                        'image/webp',
                                    )}
                                    className="w-100 h-100 object-fit-fill"
                                    alt="main image"
                                />
                            </div>
                            <div
                                dangerouslySetInnerHTML={{ __html: previewValues?.content }}
                                className="content-post text-break"
                            />
                            <div className="d-flex justify-content-end container-cancel-btn">
                                <button
                                    className="btn btn-form padding-button text-bg-danger cancel-btn"
                                    type="button"
                                    onClick={() => setIsForm(true)}
                                >
                                    {t('post-form.cancel')}
                                </button>
                                <button
                                    className="btn btn-form padding-button"
                                    type="submit"
                                    name="submit"
                                    onClick={onSubmit}
                                >
                                    {t('post-form.confirm')}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>

            <template>
                <Modal
                    text={t('article.confirm-delete')}
                    open={deleteModal}
                    setOpen={setDeleteModal}
                    confirm={deleteArticle}
                    setConfirm={setDeleteArticle}
                />
            </template>

            <template>
                <Modal
                    text={t('article.abandon-edit-article')}
                    open={openModal}
                    setOpen={setOpenModal}
                    confirm={abandonEditArticle}
                    setConfirm={setAbandonEditArticle}
                />
            </template>

            <template>
                <Modal
                    text={t('article.edit-article')}
                    open={editModal}
                    setOpen={setEditModal}
                    confirm={continueArticle}
                    setConfirm={setContinueArticle}
                />
            </template>
        </>
    );
}
