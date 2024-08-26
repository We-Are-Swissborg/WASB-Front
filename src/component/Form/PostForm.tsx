import { ChangeEvent, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Editor from '../../hook/Editor';
import Quill from "quill";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { createPost, previewPost } from "../../services/blog.service";
import { tokenDecoded } from "../../services/token.services";
import { useNavigate } from "react-router-dom";
import { TextChangeHandler } from '@types/quill';
import arrayBufferToBase64 from "../../services/arrayBufferToBase64";
import '../../css/PostForm.css';

export default function PostForm() {
    const { t } = useTranslation('global');
    const [image, setImage] = useState<string | ArrayBuffer | undefined | null>(null);
    const { register, handleSubmit, setValue } = useForm();
    const [previewValues, setPreviewValues] = useState<FieldValues>();
    const [isForm, setIsForm] = useState<boolean>(true);
    const { token } = useAuth();
    const quillRef = useRef<Quill | null>(null);
    const navigate = useNavigate();
    const isBuffer = typeof image !== 'string'; // Required for check if the image has changed.

    const onSubmit = handleSubmit((user, e) => {
        const nameTarget = e?.target.name;
        const propsForm = Object.keys(user);

        propsForm.forEach((prop , id) => {
            const isEmptyValues = user[prop] === '' || user[prop] === undefined;
            if(isEmptyValues) {
                toast.error('ERROR : ' + prop);
                throw new Error('ERROR : ' + prop);
            }

            if(propsForm.length === ++id && propsForm.length !== 3) {
                toast.error('ERROR MISS VALUE');
                throw new Error('ERROR MISS VALUE');
            }
        });

        // Display post before save post to BD
        if(nameTarget === 'preview') {
            const isTheSame = user.content === previewValues?.content;

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
            if(token && previewValues) {
                const dataPost = {
                    author: tokenDecoded(token).userId,
                    title: previewValues?.title,
                    image: previewValues?.image,
                    content: previewValues?.content
                };

                createPost(token, dataPost).then(() => {
                    toast.success('POST CREATE');
                    navigate('/', {replace: true});
                }).catch(() => {
                    toast.error('ERROR CREATE POST');
                });
            }
        }
    });

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const nameTarget = e.target?.name;
        if(nameTarget === 'image') {
            const file = e.target?.files && e.target?.files[0];
            const fileReader = new FileReader();
    
            fileReader.onload = (event) => {
                // The file's text will be printed here
                setImage(event.target?.result);
            };

            if(file) fileReader.readAsDataURL(file);
            else setImage(null);

            setValue('image', file);
        } else {
            const childNode = quillRef.current?.container.firstChild;
            const textContent = childNode?.textContent;
            let innerHTML = '';

            if(childNode instanceof HTMLElement) innerHTML = childNode?.innerHTML;
            if(!textContent) innerHTML = '';

            setValue('content', innerHTML);
        }
    };

    const srcImageBeforePreview = () => {
        if(!isBuffer) return image;
        if(isBuffer) return arrayBufferToBase64(image as unknown as ArrayBuffer, 'image/webp');
    };

    return (
        <div className="container">
            <form className='form align-items-start' onSubmit={onSubmit}>
                <div style={isForm ? {display: 'block', width: '100%'} : {display: 'none'}}>
                    <textarea className="border border-0 border-bottom border-black h1 w-100" {...register('title')} id="title" required={true} />
                    {image &&
                        <div className="container-main-image title-post overflow-hidden rounded-5 align-self-center">
                            <img src={srcImageBeforePreview()} className="w-100 h-100 object-fit-cover" alt="main image"/>
                        </div>
                    }
                    <input type="file" id="image" name="image" accept="image/*" onChange={onChange}/>
                    <Editor
                        ref={quillRef}
                        onTextChange={onChange as unknown as TextChangeHandler}
                        readOnly={false}
                    />
                    <button className='btn btn-form padding-button align-self-end' type="submit" name="preview" onClick={onSubmit}>
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
        </div>
    );
}