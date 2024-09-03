import { CardPost } from '../types/Post';
import { getPostList } from '../services/blog.service';
import useSWR, { Fetcher } from 'swr';
import { NavLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import arrayBufferToBase64 from '../services/arrayBufferToBase64';
import { useAuth } from '../contexts/AuthContext';
import { Pagination } from '@mui/material';
import PostList from '../types/PostList';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import '../css/Blog.css';

const fetcher: Fetcher<PostList> = (url: string) => getPostList(url);

function Blog() {
    const { t } = useTranslation('global');
    const { data, error, isLoading } = useSWR<PostList>(
        'posts/list/' + 1,
        fetcher,
    );
    const [dataReverse, setDataReverse] = useState<CardPost[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const { roles } = useAuth();

    useEffect(() => {
        if(data) {
            const nbPage = Math.ceil(data.totalPost / 9);
            setDataReverse(data.postListDTO);
            setTotalPages(nbPage ? nbPage : 1);
        }
    }, [data]);

    if (error) return <div>{t('blog.loading-error')}</div>;

    const onclick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const target =  e.target as HTMLElement;
        const arrow =  target.dataset.testid;
        const innerText = target.innerText;

        if(!arrow && !innerText) return;

        const value = innerText ? Number(innerText) : arrow?.includes('Before') ? Number(page)-1 : Number(page)+1;
        getPostList('posts/list/' + value).then((data) => {
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
                <div className='d-flex align-items-center justify-content-between'>
                    <h1 className="title mt-4">{t('blog.title')}</h1>
                    {roles?.includes('moderator') &&
                        <NavLink to='create-post' className="btn btn-form align-self-end py-2 px-3">
                            {t('blog.create-post')}
                        </NavLink>
                    }
                </div>
                <section className="row row-cols-1 row-cols-md-3 g-2 mb-0 mt-3 justify-content-center">
                    {isLoading && (
                        <Card className="card card-blog" aria-hidden="true">
                            <CardMedia className='card-media' src='#' />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    <span className="placeholder col-6"></span>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" className="card-text placeholder-glow">
                                    <span className="placeholder col-7"></span>
                                    <span className="placeholder col-4"></span>
                                    <span className="placeholder col-4"></span>
                                    <span className="placeholder col-6"></span>
                                    <span className="placeholder col-8"></span>
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" className="btn btn-primary disabled placeholder col-6" aria-disabled="true"></Button>
                                <Button size="small" className="btn btn-primary disabled placeholder col-6" aria-disabled="true"></Button>
                            </CardActions>
                        </Card>
                    )}
                    {dataReverse.map((post: CardPost, id: number) => {
                        const optionDate: Intl.DateTimeFormatOptions = {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        };
                        const dateLastUpdate = new Date(post.updatedAt).toLocaleDateString(`${t('blog.localCode')}`, optionDate);

                        return (
                            <Card key={'post' + id} className="card card-blog mb-5" aria-hidden="true">
                                <CardMedia
                                    className='card-media'
                                    image={arrayBufferToBase64(post.image as unknown as ArrayBuffer, 'image/webp')}
                                    title={'post' + id}
                                />
                                <CardContent className='pb-0'>
                                    <Typography gutterBottom variant="h5" component="div" className='text-nowrap overflow-hidden text-truncate'>
                                        {post.title}
                                    </Typography>
                                    <Typography variant="body2" className="card-text placeholder-glow">
                                        <span className='text-decoration-underline'>{t('blog.last-update')}:</span> {dateLastUpdate}
                                    </Typography>
                                    <Typography variant="body2" className="card-text placeholder-glow mt-2">
                                        <span className='text-decoration-underline'>{t('blog.created-by')}:</span> <strong>{post.infoAuthor.username}</strong> 
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size='small' onClick={() => copyToClipboard(post.id)}>{t('blog.share')}</Button>
                                    <strong style={{paddingBottom: '4px'}}>
                                        <NavLink
                                            role='button'
                                            className='text-decoration-none btn-read-post'
                                            to={'post-' + post.id}>{t('blog.read')}
                                        </NavLink>
                                    </strong>
                                </CardActions>
                            </Card>
                        );
                    })}
                </section>
                <Pagination
                    count={totalPages}
                    color="primary"
                    onClick={onclick}
                    className='d-flex justify-content-end m-5 mt-0'
                />
            </div>
        </>
    );
}

export default Blog;
