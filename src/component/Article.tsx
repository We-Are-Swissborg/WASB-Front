import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { updatePost, deletePost, getPost, previewPost } from "../services/blog.service";
import { useParams, useNavigate } from "react-router-dom";
import { Post } from "../types/Post";
import arrayBufferToBase64 from "../services/arrayBufferToBase64";
import { useAuth } from "../contexts/AuthContext";
import { tokenDecoded } from "../services/token.services";
import Modal from "../common/Modal";
import { toast } from "react-toastify";
import { FieldValues, useForm } from "react-hook-form";
import Quill from "quill";
import Editor from "../hook/Editor";
import { TextChangeHandler } from "quill";

export default function Article() {
    const { t } = useTranslation('global');
    const [post, setPost] = useState<Post>();
    const { idPost } = useParams();
    const [init, setInit] = useState(true);
    const { token } = useAuth();
    const [author, setAuthor] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [deleteArticle, setDeleteArticle] = useState(false);
    const [edit, setEdit] = useState(false);
    const navigate = useNavigate();
    const [image, setImage] = useState<string | ArrayBuffer | undefined | null>(null);
    const { register, handleSubmit, setValue, getValues } = useForm();
    const [previewValues, setPreviewValues] = useState<FieldValues>();
    const [isForm, setIsForm] = useState<boolean>(true);
    const quillRef = useRef<Quill | null>(null);
    const isBuffer = typeof image !== 'string'; // Required for check if the image has changed.
    const [disabledSubmit, setDisabledSubmit] = useState(true);
    const optionDate: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const isOldEqualNewValue = () => getValues().title === post?.title && getValues().image?.toString() === post?.image?.toString() && getValues().content === post?.content;

    useEffect(() => {
        if(deleteArticle) {
            const id = idPost?.split('-')[1];
            setOpenModal(false);
            deletePost(id!, token!).then(() => {
                toast.success('POST DELETE');
                navigate('../');
            }).catch((e) => {
                toast.error('ERROR POST DELETE');
                throw new Error('ERROR POST DELETE : ' + e);
            });
        }
        if(idPost && init) {
            if(token) {
                const decodedToken = tokenDecoded(token);
                setAuthor(decodedToken.userId);
            }
            getPost(idPost).then((data) => {
                setPost(data);
                setInit(false);
            }).catch(() => {
                throw new Error('ERROR GET POST');
            });
        }
    }, [post, deleteArticle, init]);

    const onSubmit = handleSubmit((user, e) => {
        const nameTarget = e?.target.name;
        const propsForm = Object.keys(user);

        propsForm.forEach((prop) => {
            const isEmptyValues = user[prop] === '' || user[prop] === undefined;
            if(isEmptyValues) {
                toast.error('ERROR : ' + prop);
                throw new Error('ERROR : ' + prop);
            }
        });

        // Display post before save post to BD
        if(nameTarget === 'preview') {
            const isTheSame = user.content === post?.content;

            if(isBuffer) user.image = image;
            if(token && (!isTheSame || !isBuffer)) {
                const formData = new FormData();

                if(!isTheSame) formData.append('contentPost', user.content);
                if(!isBuffer) formData.append('imagePost', user.image);

                previewPost(token, formData).then((res) => {
                    if(res.clean) user.content = res.clean;
                    if(res.convertToWebp) {
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
            if(token && previewValues && post?.id) {
                updatePost(post.id, previewValues, token).then(() => {
                    toast.success('POST UPDATE');
                    setEdit(false);
                    setInit(true);
                    setIsForm(true);
                }).catch(() => {
                    toast.error('ERROR UPDATE POST');
                });
            }
        }
    });

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const nameTarget = e.target?.name;
        const initImage = post?.image as unknown as ArrayBuffer;

        if(nameTarget === 'image') {
            const file = e.target?.files && e.target?.files[0];
            const fileReader = new FileReader();

            fileReader.onload = (event) => {
                // The file's text will be printed here.
                setImage(event.target?.result);
            };

            if(file) fileReader.readAsDataURL(file);
            else setImage(initImage);

            setValue('image', file ?? initImage);
        } else {
            const childNode = quillRef.current?.container.firstChild;
            const textContent = childNode?.textContent;
            let innerHTML = '';
            if(childNode instanceof HTMLElement) innerHTML = childNode?.innerHTML;
            if(!textContent) innerHTML = '';

            setValue('content', innerHTML);
        }
        setDisabledSubmit(isOldEqualNewValue());
    };

    const onChangeTexteArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const valueTarget = e.target?.value;
        setValue('title', valueTarget);

        setDisabledSubmit(isOldEqualNewValue());
    };

    const onEdit = () => {
        setEdit(true);
        setValue('title', post?.title);
        setValue('image', post?.image);
        setValue('content', post?.content);
        setImage(post?.image as unknown as ArrayBuffer);
        setDisabledSubmit(isOldEqualNewValue());
    };

    const srcImageBeforePreview = () => {
        if(!isBuffer) return image;
        if(isBuffer) return arrayBufferToBase64(getValues().image.length > 0 ? getValues().image : previewValues?.image, 'image/webp');
    };

    return (
        <>
            <div className="container">
                {!edit ?
                    <>
                        <div className="d-flex align-items-center justify-content-between">
                            <h1>{post?.title}</h1>
                            {post?.author === author &&
                                <div>
                                    <button onClick={() => setOpenModal(true)}>Delete</button>
                                    <button onClick={onEdit}>Edit</button>
                                </div>
                            }
                        </div>
                        <div className="container-main-image title-post overflow-hidden rounded-5 align-self-center">
                            <img src={arrayBufferToBase64(post?.image as unknown as ArrayBuffer, 'image/webp')} className="w-100 h-100 object-fit-cover" alt="main image"/>
                        </div>
                        <div dangerouslySetInnerHTML={{__html: post?.content ?? "DEFAULT"}} className="content-post"/>
                        <div>
                            {post &&
                                <>
                                    <p>Author: {post?.infoAuthor.username}</p>
                                    <p>Created at: {new Date(post?.createdAt).toLocaleDateString(`${t('blog.localCode')}`, optionDate)}</p>
                                    <p>Last update: {new Date(post?.updatedAt).toLocaleDateString(`${t('blog.localCode')}`, optionDate)}</p>
                                </>
                            }
                        </div>
                    </> :
                    <form className='form align-items-start' onSubmit={onSubmit}>
                        <div style={isForm ? {display: 'block', width: '100%'} : {display: 'none'}}>
                            <textarea
                                className="border border-0 border-bottom border-black h1 w-100"
                                {...register('title')}
                                id="title"
                                required={true}
                                onChange={onChangeTexteArea}
                                defaultValue={getValues()?.title}
                            />
                            <div className="container-main-image title-post overflow-hidden rounded-5 align-self-center">
                                <img src={srcImageBeforePreview()} className="w-100 h-100 object-fit-cover" alt="main image" />
                            </div>
                            <div className="d-flex align-items-center">
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={onChange}
                                    style={getValues().image.name ? {width: 'initial'} : {width: '100px'}}
                                />
                                {!getValues().image.name && <p className="m-0 ms-1">{'Initial image'}</p>}
                            </div>
                            <Editor
                                ref={quillRef}
                                onTextChange={onChange as unknown as TextChangeHandler}
                                readOnly={false}
                                defaultValue={getValues()?.content}
                            />
                            <button className='btn btn-form padding-button align-self-end' type="submit" name="preview" onClick={onSubmit} disabled={disabledSubmit}>
                  PREVIEW
                            </button>
                        </div>
                        <div style={isForm ? {display: 'none'} : {display: 'block', width: '100%'} }>
                            <h1>{previewValues?.title}</h1>
                            <div className="container-main-image title-post overflow-hidden rounded-5 align-self-center">
                                <img src={arrayBufferToBase64(previewValues?.image as unknown as ArrayBuffer, 'image/webp')} className="w-100 h-100 object-fit-cover" alt="main image"/>
                            </div>
                            <div dangerouslySetInnerHTML={{__html: previewValues?.content}} className="content-post"/>
                            <div className="align-self-end">
                                <button className='btn btn-form padding-button' type="button" onClick={() => setIsForm(true)}>CANCEL</button>
                                <button className='btn btn-form padding-button' type="submit" name="submit" onClick={onSubmit}>CONFIRM</button>
                            </div>
                        </div>
                    </form>
                }
            </div>

            <template>
                <Modal
                    text="Do you really want delete this article ?"
                    open={openModal}
                    setOpen={setOpenModal}
                    confirm={deleteArticle}
                    setConfirm={setDeleteArticle}
                />
            </template>
        </>
    );
}