import { Post } from '../types/Post';
import { getAllPosts } from '../services/blog.service';
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
import '../css/Blog.css';

const fetcher: Fetcher<Post[]> = (url: string) => getAllPosts(url);

function Blog() {
    const { data, error, isLoading } = useSWR<Post[]>(
        'posts',
        fetcher,
    );
    const [dataReverse, setDataReverse] = useState<Post[]>([]);

    useEffect(() => {
        if(data) {
            setDataReverse(data.reverse());
        }
    }, [data]);

    if (error) return <div>échec du chargement</div>;

    const summarizeContent = (content: string) => {
        return ( 'At summarize' );
    };

    return (
        <>
            <div className="container">
                <div className='d-flex align-items-center justify-content-between'>
                    <h1 className="title mt-4">Le blog</h1>
                    <NavLink to='create-post'>
                        CREATE POST
                    </NavLink>
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
                    {dataReverse.map((post: Post, id: number) => {
                        return (
                            <Card key={'post' + id} sx={{ maxWidth: 345 }} className="card mb-5" aria-hidden="true">
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image={arrayBufferToBase64(post.image as unknown as ArrayBuffer)}
                                    title={'post' + id}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {post.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" className="card-text placeholder-glow">
                                        {summarizeContent(post.content)}
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
            </div>
        </>
    );
}

export default Blog;
