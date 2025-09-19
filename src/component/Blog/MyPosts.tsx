import { getMyPosts } from '@/services/blog.service';
import BlogCard from './BlogCard';
import { useTranslation } from 'react-i18next';
import { UseAuth } from '@/contexts/AuthContext';
import { tokenDecoded } from '@/services/token.services';

type IFetcher = [string, string, () => void];

const fetcher = ([url, token, setToken]: IFetcher) => getMyPosts(url, token, setToken);

export default function MyPosts() {
    const { t } = useTranslation();
    const { token } = UseAuth();
    const userId = tokenDecoded(token!).userId;

    return (
        <div className="container">
            <BlogCard fetcher={fetcher} title={t('my-posts.title')} userId={userId} />
        </div>
    );
}
