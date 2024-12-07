import { NavLink, useParams } from 'react-router-dom';
import { Post as PostType } from '../types/Post';
import * as PostServices from '../services/blog.service';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR, { Fetcher } from 'swr';
import '../css/Blog.css';

const fetcher: Fetcher<PostType> = (url: string) => PostServices.getPost(url);

export default function Post() {
    const { t } = useTranslation('global');
    const { slug } = useParams();
    const [post, setPost] = useState<PostType>();

    const { data, error, isLoading } = useSWR<PostType>(`/${slug}`, fetcher);

    const optionDate: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };

    useEffect(() => {
        if (data) {
            setPost(data);
        }
    }, [data]);

    if (error) return <div>{t('blog.loading-error')}</div>;

    if (isLoading) return <div>{t('common.loading')}</div>;

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10 col-sm-12 mx-auto pb-3">
                    {post && (
                        <>
                            <header className="mb-4">
                                <h1 className="display-4 mt-4">{post.title}</h1>
                                <div className="text-muted">
                                    <p className="mb-1">
                                        <i className="fa fa-at"></i> {t('blog.published-by')}{' '}
                                        <strong>{post.infoAuthor.username}</strong>
                                    </p>
                                    <p className="mb-1">
                                        <i className="fa fa-calendar-days"></i> {t('blog.published-at')}{' '}
                                        {new Date(post.publishedAt).toLocaleDateString(
                                            `${t('blog.localCode')}`,
                                            optionDate,
                                        )}
                                    </p>
                                    <div className="mb-2">
                                        {post.categories.map((category) => (
                                            <span key={category.id} className="badge bg-secondary me-1">
                                                {category.title}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </header>

                            <div className="container-main-image title-post overflow-hidden rounded-5 align-self-center mb-5">
                                <img
                                    src={post.image64}
                                    width={856}
                                    height={419}
                                    className="object-fit-cover shadow"
                                    alt="main image"
                                />
                            </div>

                            <section className="post-content">
                                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                            </section>

                            <aside className="author-info">
                                <h3>{t('blog.about-author')}</h3>
                                <p>{post.infoAuthor.username}</p>
                            </aside>
                        </>
                    )}

                    <NavLink className="btn btn-secondary" to="/blog">
                        <i className="fa fa-chevron-left"></i> {t('blog.return-blog')}
                    </NavLink>
                </div>
            </div>
        </div>
    );
}