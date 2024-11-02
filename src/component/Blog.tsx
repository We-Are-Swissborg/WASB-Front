import { CardPost, PaginatedPostsResponse } from '../types/Post';
import { getPosts } from '../services/blog.service';
import useSWR, { Fetcher } from 'swr';
import { Link, NavLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CardActionArea, Pagination } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import '../css/Blog.css';

const fetcher: Fetcher<PaginatedPostsResponse> = (url: string) => getPosts(url);

function Blog() {
    const { t } = useTranslation('global');
    const { data, error, isLoading } = useSWR<PaginatedPostsResponse>(`/posts?page=${1}&limit=${9}`, fetcher);
    const [dataReverse, setDataReverse] = useState<CardPost[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const { roles } = useAuth();

    useEffect(() => {
        if (data) {
            setDataReverse(data.posts);
            setTotalPages(data.totalPages);
        }
    }, [data]);

    if (error) return <div>{t('blog.loading-error')}</div>;

    const onclick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const target = e.target as HTMLElement;
        const arrow = target.dataset.testid;
        const innerText = target.innerText;

        if (!arrow && !innerText) return;

        const value = innerText ? Number(innerText) : arrow?.includes('Before') ? Number(page) - 1 : Number(page) + 1;
        getPosts('posts/list/' + value).then((data) => {
            setDataReverse(data.postListDTO);
            setPage(value);
        });
    };

    const copyToClipboard = (postId: number) => {
        const url = `${window.location.origin}/post-${postId}`;
        navigator.clipboard.writeText(url);

        toast.success(t('blog.url-copied'));
    };

    return (
        <>
            <div className="container">
                <div className="d-flex align-items-center justify-content-between">
                    <h1 className="title mt-4">{t('blog.title')}</h1>
                    {roles?.includes('moderator') && (
                        <NavLink to="create-post" className="btn btn-form align-self-end py-2 px-3">
                            {t('blog.create-post')}
                        </NavLink>
                    )}
                </div>
                <section className="row row-cols-1 row-cols-md-3 g-2 mb-0 mt-3 justify-content-center">
                    {isLoading && (
                        <Card className="card card-blog" aria-hidden="true">
                            <CardMedia className="card-media" src="#" />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    <span className="placeholder col-6"></span>
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    className="card-text placeholder-glow"
                                >
                                    <span className="placeholder col-7"></span>
                                    <span className="placeholder col-4"></span>
                                    <span className="placeholder col-4"></span>
                                    <span className="placeholder col-6"></span>
                                    <span className="placeholder col-8"></span>
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    className="btn btn-primary disabled placeholder col-6"
                                    aria-disabled="true"
                                ></Button>
                                <Button
                                    size="small"
                                    className="btn btn-primary disabled placeholder col-6"
                                    aria-disabled="true"
                                ></Button>
                            </CardActions>
                        </Card>
                    )}
                    {dataReverse.map((post: CardPost, id: number) => {
                        const optionDate: Intl.DateTimeFormatOptions = {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric'
                        };
                        const dateLastUpdate = new Date(post.publishedAt).toLocaleDateString(
                            `${t('blog.localCode')}`,
                            optionDate
                        );

                        return (
                            <Card key={'post' + id} className="card card-blog mb-5" aria-hidden="true">
                                <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <CardActionArea >
                                        <CardMedia
                                            component="img"
                                            className="card-media"
                                            image={'https://placehold.co/907x445.png'}
                                            title={'post' + id}
                                        />
                                        <CardContent className="pb-2">
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="div"
                                                className="text-nowrap overflow-hidden text-truncate"
                                            >
                                                {post.title}
                                            </Typography>
                                            <Typography variant="body2" className="card-text placeholder-glow">
                                                {dateLastUpdate}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Link>
                            </Card>
                        );
                    })}
                </section>
                <Pagination
                    count={totalPages}
                    color="primary"
                    onClick={onclick}
                    className="d-flex justify-content-end m-5 mt-0"
                />
            </div>
        </>
    );
}

export default Blog;
