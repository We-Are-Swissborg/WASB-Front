import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getPost } from "../services/blog.service";
import { useParams } from "react-router-dom";
import { Post } from "../types/Post";
import arrayBufferToBase64 from "../services/arrayBufferToBase64";

export default function OnePost() {
    const { t } = useTranslation('global');
    const [post, setPost] = useState<Post>();
    const { idPost } = useParams();
    const [init, setInit] = useState(true);

    useEffect(() => {
        if(idPost && init) {
            getPost(idPost).then((data) => {
                setPost(data);
                setInit(false);
            }).catch(() => {
                throw new Error('ERROR GET POST');
            });
        }
    }, [post]);

    return (
        <div className="container">
            <h1>{post?.title}</h1>
            <div className="container-main-image title-post overflow-hidden rounded-5 align-self-center">
                <img src={arrayBufferToBase64(post?.image as unknown as ArrayBuffer)} className="w-100 h-100 object-fit-cover" alt="main image"/>
            </div>
            <div dangerouslySetInnerHTML={{__html: post?.content ?? "DEFAULT"}} className="content-post"/>
        </div>
    ); 
}