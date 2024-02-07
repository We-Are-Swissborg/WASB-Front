import { useEffect, useState } from "react";
import { Post } from '../types/Post';


export default function Blog() {
  const [data, setData] = useState<Post[]>([]);

  useEffect(() => {
    getPosts().then(
      result => {
        setData(result);
      }
    )
  }, []);

    return (
      <>
      <div className="container">
        <h1 className="title mt-4">Le blog</h1>
        <section className="row row-cols-1 row-cols-md-3 g-2 mb-3">
          {data.map((post: Post) => (
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

async function getPosts() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=10");
  const posts = await response.json() as Post[];
  return posts;
}