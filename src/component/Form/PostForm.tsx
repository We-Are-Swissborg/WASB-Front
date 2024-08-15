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
import '../../css/PostForm.css';

export default function PostForm() {
    const { t } = useTranslation('global');
    const [preview, setPreview] = useState<string | ArrayBuffer | undefined | null>(null);
    const { register, handleSubmit, setValue } = useForm();
    const [fieldValues, setFieldValues] = useState<FieldValues>();
    const [isForm, setIsForm] = useState<boolean>(true);
    const { token } = useAuth();
    const quillRef = useRef<Quill | null>(null);
    const navigate = useNavigate();

    const onSubmit = handleSubmit((user, e) => {
        const nameTarget = e?.target.name;
        const propsForm = Object.keys(user);

        // Display post before save post to BD
        const previewClean = () => {
            const nameFile = user.image;
            const fileReader = new FileReader();

            fileReader.onload = (event) => {
                // The file's text will be printed here
                setPreview(event.target?.result);
            };
            fileReader.readAsDataURL(nameFile);
            setIsForm(false);
            setFieldValues(user);
        };

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

        if(nameTarget === 'preview') {
            const isTheSame = user.content === fieldValues?.content;

            if(token && !isTheSame) {
                // Clean code before the preview
                previewPost(token, user.content).then((res) => {
                    user.content = res.clean;
                    previewClean();
                });
            } else {
                previewClean();
            }
        } else {
            if(token) {
                const formData = new FormData();
                const dataPost = {
                    author: tokenDecoded(token).userId,
                    title: fieldValues?.title,
                    content: fieldValues?.content
                };

                formData.append('dataPost', JSON.stringify(dataPost));
                formData.append('imagePost', fieldValues?.image);

                createPost(token, formData).then(() => {
                    toast.success('POST CREATE');
                    navigate('/', {replace: true});
                }).catch(() => {
                    toast.error('ERROR CREATE POST');
                });
            }
        }
    });

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const childNode = quillRef.current?.container.firstChild;
        const textContent = childNode?.textContent;
        let innerHTML = '';

        const nameTarget = e.target?.name;
        const nameFile = e.target?.files && e.target?.files[0];

        if(childNode instanceof HTMLElement) innerHTML = childNode?.innerHTML;
        if(!textContent) innerHTML = '';

        if(nameTarget === 'image') setValue('image', nameFile);
        else setValue('content', innerHTML);
    };

    return (
        <div className="container">
            <form className='form align-items-start' onSubmit={onSubmit}>
                <div style={isForm ? {display: 'block', width: '100%'} : {display: 'none'}}>
                    <textarea className="border border-0 border-bottom border-black h1 w-100" {...register('title')} id="title" required={true}/>

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
                    <h1>{fieldValues?.title}</h1>
                    <div className="container-main-image title-post overflow-hidden rounded-5 align-self-center">
                        <img src={preview as string} className="w-100 h-100 object-fit-cover" alt="main image"/>
                    </div>
                    <div dangerouslySetInnerHTML={{__html: fieldValues?.content}} className="content-post"/>
                    <div className="align-self-end">
                        <button className='btn btn-form padding-button' type="button" onClick={() => setIsForm(true)}>CANCEL</button>
                        <button className='btn btn-form padding-button' type="submit" name="submit" onClick={onSubmit}>CONFIRM</button>
                    </div>
                </div>
            </form>
        </div>
    ); 
}