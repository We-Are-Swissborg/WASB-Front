import { CardPost, PaginatedPostsResponse } from '../types/Post';
import * as PostServices from '../services/blog.service';
import useSWR, { Fetcher, mutate } from 'swr';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Typography,
    CardActionArea,
    Pagination
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../css/Blog.css';
import { CalendarMonthSharp } from '@mui/icons-material';

const fetcher: Fetcher<PaginatedPostsResponse> = (url: string) => PostServices.getPosts(url);

function Blog() {
    const { t, i18n } = useTranslation();
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [limit] = useState<number>(9);
    const { data, error, isLoading } = useSWR<PaginatedPostsResponse>(
        `${i18n.language}?page=${page}&limit=${limit}`,
        fetcher,
        {
            revalidateOnFocus: false,
        },
    );
    const [dataReverse, setDataReverse] = useState<CardPost[]>([]);

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

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        mutate(`/posts?page=${value}&limit=${limit}`);
    };

    return (
        <>
            <div className="container">
                <div className="d-flex align-items-center justify-content-between mt-4">
                    <h1 className="title">{t('blog.title')}</h1>
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
                                            sx={{
                                                width: '100%',
                                                aspectRatio: '16/9',
                                                objectFit: 'cover'
                                            }}
                                            image={post.image64}
                                            title={post.title}
                                        />
                                        <CardContent className="pb-2">
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="div"
                                                sx={{
                                                    display: '-webkit-box',
                                                    overflow: 'hidden',
                                                    WebkitBoxOrient: 'vertical',
                                                    WebkitLineClamp: 3,
                                                    minHeight: '6rem'
                                                }}
                                            >
                                                {post.title}
                                            </Typography>
                                            <div className="mb-2">
                                                {post.categories.map((category) => {
                                                    return (
                                                        <span key={category.id} className="badge bg-secondary me-1">
                                                            {category.title}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                            <Typography variant="body2" className="card-text placeholder-glow">
                                                <CalendarMonthSharp /> {dateLastUpdate}
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
