import { getPosts } from '@/services/blog.service';
import { PaginatedPostsResponse } from '@/types/Post';
import { useTranslation } from 'react-i18next';
import { Fetcher } from 'swr';
import BlogCard from './BlogCard';

const fetcher: Fetcher<PaginatedPostsResponse> = (url: string) => getPosts(url);

export default function Blog() {
    const { t } = useTranslation();

    return (
        <div className="container">
            <BlogCard fetcher={fetcher} title={t('blog.title')} />
        </div>
    );
}
