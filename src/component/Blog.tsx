import { Post } from '../types/Post';
import { getPosts } from "../services/blog.service";
import useSWR, { Fetcher } from "swr";

const fetcher: Fetcher<Post[]> = (url: string) => getPosts(url);

function Blog() {
    const { data, error, isLoading } = useSWR<Post[]>('https://jsonplaceholder.typicode.com/posts?_limit=6&_delay=2200', fetcher);

    if (error) return <div>échec du chargement</div>;

    return (
        <>
            <div className="container">
                <h1 className="title mt-4">Le blog</h1>
                <section className="row row-cols-1 row-cols-md-3 g-2 mb-3">
                    {isLoading &&
                    <div className="card" aria-hidden="true">
                        <div className="card-body">
                            <h5 className="card-title placeholder-glow">
                                <span className="placeholder col-6"></span>
                            </h5>
                            <p className="card-text placeholder-glow">
                                <span className="placeholder col-7"></span>
                                <span className="placeholder col-4"></span>
                                <span className="placeholder col-4"></span>
                                <span className="placeholder col-6"></span>
                                <span className="placeholder col-8"></span>
                            </p>
                            <a className="btn btn-primary disabled placeholder col-6" aria-disabled="true"></a>
                        </div>
                    </div>
                    }

                    {data?.map((post: Post) => (
                        <div className="col" key={post.id}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text">{post.body}</p>
                                    <a href="#" className="btn btn-primary">Go somewhere</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </>
    );
}

export default Blog;
