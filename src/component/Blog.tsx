import { CardPost } from '../types/Post';
import { getPostRange } from '../services/blog.service';
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
import PostRange from '../types/PostRange';
import { useTranslation } from 'react-i18next';
import '../css/Blog.css';

const fetcher: Fetcher<PostRange> = (url: string) => getPostRange(url);

function Blog() {
    const { t } = useTranslation('global');
    const { data, error, isLoading } = useSWR<PostRange>(
        'posts/range/' + 1,
        fetcher,
    );
    const [dataReverse, setDataReverse] = useState<CardPost[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const { roles } = useAuth();

    useEffect(() => {
        if(data) {
            const nbPage = Math.ceil(data.totalPost / 9);
            setDataReverse(data.postRangeDTO);
            setTotalPages(nbPage ? nbPage : 1);
        }
    }, [data]);

    if (error) return <div>échec du chargement</div>;

    const onclick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const target =  e.target as HTMLElement;
        const arrow =  target.dataset.testid;
        const innerText = target.innerText;

        if(!arrow && !innerText) return;

        const value = innerText ? Number(innerText) : arrow?.includes('Before') ? Number(page)-1 : Number(page)+1;
        getPostRange('posts/range/' + value).then((data) => {
            setDataReverse(data.postRangeDTO);
            setPage(value);
        });
    };

    return (
        <>
            <div className="container">
                <div className='d-flex align-items-center justify-content-between'>
                    <h1 className="title mt-4">Le blog</h1>
                    {roles?.includes('moderator') &&
                        <NavLink to='create-post'>
                            CREATE POST
                        </NavLink>
                    }
                </div>
                <section className="row row-cols-1 row-cols-md-3 g-2 mb-5 mt-3 justify-content-center">
                    {isLoading && (
                        <Card sx={{ maxWidth: 345 }} className="card" aria-hidden="true">
                            <CardMedia sx={{ height: 140 }} src='#' />
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
                            <CardActions sx={{ maxWidth: 230 }}>
                                <Button size="small" className="btn btn-primary disabled placeholder col-6" aria-disabled="true"></Button>
                                <Button size="small" className="btn btn-primary disabled placeholder col-6" aria-disabled="true"></Button>
                            </CardActions>
                        </Card>
                    )}
                    {dataReverse.map((post: CardPost, id: number) => {
                        const date = new Date(post.updatedAt);
                        const optionDate: Intl.DateTimeFormatOptions = {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        };
                        return (
                            <Card key={'post' + id} sx={{ maxWidth: 345 }} className="card mb-5" aria-hidden="true">
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image={arrayBufferToBase64(post.image as unknown as ArrayBuffer, 'image/webp')}
                                    title={'post' + id}
                                />
                                <CardContent className='pb-0'>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {post.title}
                                    </Typography>
                                    <Typography variant="body2" className="card-text placeholder-glow">
                                        Last update: {date.toLocaleDateString(`${t('blog.localCode')}`, optionDate)}
                                    </Typography>
                                    <Typography variant="body2" className="card-text placeholder-glow mt-2">
                                        Created by: <strong>{post.infoAuthor.username}</strong> 
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" aria-disabled="true">SHARE</Button>
                                    <NavLink role='button' aria-disabled="true" to={'post-' + post.id}>LEARN MORE</NavLink>
                                </CardActions>
                            </Card>
                        );
                    })}
                </section>
                <Pagination
                    count={totalPages}
                    color="primary"
                    onClick={onclick}
                />
            </div>
        </>
    );
}

export default Blog;
