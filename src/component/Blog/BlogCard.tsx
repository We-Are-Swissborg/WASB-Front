import { CardPost, PaginatedPostsResponse } from '../../types/Post';
import useSWR, { BareFetcher, mutate } from 'swr';
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
import '../../css/Blog.css';
import { CalendarMonthSharp } from '@mui/icons-material';
import { UseAuth } from '@/contexts/AuthContext';
import * as BlogService from '@/services/blog.service';
import { toast } from 'react-toastify';
import DeleteIcon from '../../assets/images/trash.svg';

type IBlogCard = {
    fetcher: BareFetcher<PaginatedPostsResponse>,
    title: string,
    userId?: number
}

function BlogCard({fetcher, title, userId}: IBlogCard) {
    const { t, i18n } = useTranslation();
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [limit] = useState<number>(9);
    const { token, setToken } = UseAuth();
    const [ isDelete, setIsDelete ] = useState<boolean>(false);
    const [ nbSelect, setNbSelect ] = useState<number>(0);
    const [ listIdToDelete, setListIdToDelete ] = useState<number[]>([]);

    const url = userId ?
        [`posts/myPosts/${i18n.language}?page=${page}&limit=${limit}&userId=${userId}`, token, setToken] :
        `posts/${i18n.language}?page=${page}&limit=${limit}`;
    const { data, error, isLoading } = useSWR<PaginatedPostsResponse>(
        url,
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

    const cardContent = (post: CardPost) => {
        const dateLastUpdate = new Date(post.publishedAt).toLocaleDateString(
            `${t('blog.localCode')}`,
            optionDate,
        );

        return (
            <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }} className={isDelete ? 'disabled-a h-100 d-block' : 'h-100 d-block'}>
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
        )
    };

    const onDelete = () => {
        setIsDelete(true);
    }

    const onCancel = () => {
        setListIdToDelete([]);
        setIsDelete(false);
        setNbSelect(0)
    }

    const onConfirm = () => {
        BlogService.deletePosts(listIdToDelete, token!, setToken).then((res) => {
            if(!res) throw new Error;
            const newDataReverse = dataReverse.filter((data) => !listIdToDelete.includes(data.id));

            setDataReverse(newDataReverse);
            onCancel();
            toast.success(t('blog.posts-delete'));
        }).catch(() => {
            toast.error(t('blog.error-delete'));
        })
    }

    const onSelectToDelete = (id: number) => {
        const isInList = listIdToDelete.includes(id);

        if(isInList) {
            const newList = listIdToDelete.filter((e) => e !== id);
            setListIdToDelete(newList);
            setNbSelect(newList.length);
        } else {
            setListIdToDelete([...listIdToDelete, id]);
            setNbSelect(listIdToDelete.length + 1);
        }
    }

    return (
        <>
            <div className="container">
                <div className="d-flex align-items-center justify-content-between mt-4">
                    <h1 className="title">{title}</h1>
                    { userId && (
                        !isDelete ? 
                            <Button variant="contained" className='bg-secondary text-primary' endIcon={<img src={DeleteIcon}/>} onClick={onDelete}>
                                {t('blog.delete')}
                            </Button> :

                            <div className='button-after-h1'>
                                <Button variant="contained" color='error' onClick={onCancel}>
                                    {t('blog.cancel')}
                                </Button>
                                <Button
                                    variant="contained"
                                    className={nbSelect ? 'bg-secondary text-primary confirm' : 'confirm'}
                                    onClick={onConfirm}
                                    disabled={nbSelect ? false : true}
                                    style={{ marginLeft: '20px' }}>
                                    {`${t('blog.confirm')} (${nbSelect})`}
                                </Button>
                            </div>
                        )
                    }
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
                        return (
                            <Card key={'post' + id} className="card card-blog mb-5" aria-hidden="true">
                                { isDelete ? 
                                    <CardActionArea
                                        onClick={() => onSelectToDelete(post.id)}
                                        data-active={listIdToDelete.includes(post.id) ? '' : undefined}
                                        sx={{
                                            '&[data-active]': {
                                                filter: 'brightness(0.5)',
                                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                '&:hover': {
                                                    backgroundColor: 'action.selectedHover',
                                                },
                                            },
                                            ":hover": {
                                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                            },
                                            height: '100%'
                                        }}
                                    >
                                        {cardContent(post)}
                                    </CardActionArea> :
                                    cardContent(post)
                                }
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

export default BlogCard;
