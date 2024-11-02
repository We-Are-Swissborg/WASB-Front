import { useParams } from "react-router-dom";
import { Post as PostType } from '../types/Post';
import * as PostServices from '../services/blog.service';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useSWR, { Fetcher } from "swr";
import '../css/Blog.css';

const fetcher: Fetcher<PostType> = (url: string) => PostServices.getPost(url);

export default function Post() {
    const { t } = useTranslation('global');
    const { slug } = useParams();
    const [post, setPost] = useState<PostType>();

    const { data, error, isLoading } = useSWR<PostType>(`/${slug}`, fetcher);

    useEffect(() => {
        if (data) {
            setPost(data);
        }
    }, [data]);

    if (error) return <div>{t('blog.loading-error')}</div>;

    if (isLoading) return <div>Chargement du blog en cours !!! </div>;

    return (
        <div className="container">
            {post && (
                <>
                    <header className="mb-4">
                        <h1 className="display-4 mt-4">{post.title}</h1>
                        <div className="text-muted">
                            <p className="mb-1">Écrit par <strong>{post.infoAuthor.username}</strong></p>
                            <p className="mb-1">Publié le {new Date(post.publishedAt).toLocaleDateString()}</p>
                            <div className="mb-2">
                                {post.categories.map((category) => (
                                    <span key={category.id} className="badge bg-secondary me-1">{category.title}</span>
                                ))}
                            </div>
                        </div>
                    </header>

                    <div className="container-main-image title-post overflow-hidden rounded-5 align-self-center mb-5">
                        <img
                            src={'https://placehold.co/907x445.png'}
                            className="w-100 h-100 object-fit-cover"
                            alt="main image"
                        />
                    </div>

                    <section className="post-content">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </section>

                    <aside className="author-info">
                        <h3>À propos de l'auteur</h3>
                        <p>{post.infoAuthor.username}</p>
                    </aside>
                </>
            )}
        </div>
            
    );
}