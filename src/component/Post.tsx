import { NavLink, useParams } from 'react-router-dom';
import { Post as PostType } from '../types/Post';
import * as PostServices from '../services/blog.service';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR, { Fetcher } from 'swr';
import '../css/Blog.css';
import { AlternateEmailSharp, CalendarMonthSharp, ChevronLeftSharp } from '@mui/icons-material';
import 'quill/dist/quill.snow.css';

const fetcher: Fetcher<PostType> = (url: string) => PostServices.getPost(url);

export default function Post() {
    const { t, i18n } = useTranslation();
    const { slug } = useParams();
    const [post, setPost] = useState<PostType>();

    const { data, error, isLoading } = useSWR<PostType>(`${i18n.language}/${slug}`, fetcher);

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
            <div className="row">
                <div className="col-lg-10 col-md-10 col-sm-12 mx-auto pb-3">
                    {post && (
                        <>
                            <header className="mb-4">
                                <h1 className="display-4 mt-4 text-justify">{post.title}</h1>
                                <div className="text-muted">
                                    <p className="mb-1">
                                        <AlternateEmailSharp /> {t('blog.published-by')} <strong>{post.author}</strong>
                                    </p>
                                    <p className="mb-1">
                                        <CalendarMonthSharp /> {t('blog.published-at')}{' '}
                                        {new Date(post.publishedAt!).toLocaleDateString(
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
                            <div className="col-md-10 mx-auto my-4">
                                <div className="ratio ratio-16x9">
                                    <img
                                        src={post.image64}
                                        className="img-fluid object-fit-cover w-100"
                                        alt="main image"
                                    />
                                </div>
                            </div>

                            <section className="post-content">
                                <article className="ql-editor" dangerouslySetInnerHTML={{ __html: post.content }} />
                            </section>

                            <aside className="author-info">
                                <h3>{t('blog.about-author')}</h3>
                                <p>{post.author}</p>
                            </aside>
                        </>
                    )}

                    <NavLink className="btn btn-secondary" to="/blog">
                        <ChevronLeftSharp /> {t('blog.return-blog')}
                    </NavLink>
                </div>
            </div>
        </div>
    );
}
