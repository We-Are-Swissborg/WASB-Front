import { CardPost, PaginatedPostsResponse } from '../types/Post';
import { getPosts } from '../services/blog.service';
import useSWR, { Fetcher, mutate } from 'swr';
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
import '../css/Blog.css';

const fetcher: Fetcher<PaginatedPostsResponse> = (url: string) => getPosts(url);

function Blog() {
    const { t } = useTranslation('global');
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [limit] = useState<number>(9);
    const { data, error, isLoading } = useSWR<PaginatedPostsResponse>(`/posts?page=${page}&limit=${limit}`, fetcher, {
        revalidateOnFocus: false,
    });
    const [dataReverse, setDataReverse] = useState<CardPost[]>([]);
    const { roles } = useAuth();

    const optionDate: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };

    useEffect(() => {
        if (data) {
            setDataReverse(data.posts);
            setTotalPages(data.totalPages);
        }
    }, [data]);

    if (error) return <div>{t('blog.loading-error')}</div>;

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        mutate(`/posts?page=${value}&limit=${limit}`);
    };

    return (
        <>
            <div className="container">
                <div className="d-flex align-items-center justify-content-between">
                    <h1 className="title mt-4">{t('blog.title')}</h1>
                    {/* {roles?.includes('moderator') && (
                        <NavLink to="create-post" className="btn btn-form align-self-end py-2 px-3">
                            {t('blog.create-post')}
                        </NavLink>
                    )} */}
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
                        const dateLastUpdate = new Date(post.publishedAt).toLocaleDateString(
                            `${t('blog.localCode')}`,
                            optionDate,
                        );

                        return (
                            <Card key={'post' + id} className="card card-blog mb-5" aria-hidden="true">
                                <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <CardActionArea>
                                        <CardMedia
                                            component="img"
                                            className="card-media object-fill-none"
                                            width={425}
                                            height={208}
                                            image={post.image64}
                                            title={post.title}
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
                                            <div className="mb-2">
                                                {post.categories.map((category) => (
                                                    <span key={category.id} className="badge bg-secondary me-1">
                                                        {category.title}
                                                    </span>
                                                ))}
                                            </div>
                                            <Typography variant="body2" className="card-text placeholder-glow">
                                                <i className="fa fa-calendar-days"></i> {dateLastUpdate}
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
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    className="d-flex justify-content-end m-5 mt-0"
                    variant="outlined"
                />
            </div>
        </>
    );
}

export default Blog;
