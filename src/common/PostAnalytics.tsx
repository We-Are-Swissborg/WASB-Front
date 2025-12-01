import { postFetch } from '@/services/baseAPI.services';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type IPostAnalytics = {
    postId: number,
    lang: string
}

export default function PostAnalytics({postId, lang}: IPostAnalytics) {
    const location = useLocation();

    const checkView = async (clientId: string) => {
        const url = `posts/${postId}/view`
        const body = JSON.stringify({ clientId, lang }) 
        await postFetch(url, body)
            .then(res => res.json())
            .then(data => {
                if (data.isFirstView) {
                    console.log('First recorded visit for the post :', postId);
                }
            })
            .catch(console.error);
    }

    useEffect(() => {
        if (window.gtag) {
            window.gtag('config', import.meta.env.VITE_MEASUREMENT_ID_GA4, {
                page_path: location.pathname + location.search,
                page_title: document.title
            });
        }
    }, [location]);

    useEffect(() => {
        const getClientId = () => {
            const cookies = document.cookie.split(';').reduce((acc, cookie) => {
                const [name, value] = cookie.trim().split('=');
                acc[name] = value;
                return acc;
            }, {} as Record<string, string>);

            const gaCookie = cookies['_ga'];
            if (gaCookie) {
                return gaCookie.split('.').slice(2).join('.');
            }
            return null;
        };

        const clientId = getClientId();

        if (!clientId) {
            console.warn('GA4 ID client no found');
            return;
        }
        (async () => await checkView(clientId))();
    }, [postId]);

    return null;
}
