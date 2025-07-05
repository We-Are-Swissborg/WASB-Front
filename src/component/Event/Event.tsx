import { getAllSessions } from '@/services/session.service';
import { PaginatedSessionsResponse } from '@/types/Session';
import { useTranslation } from 'react-i18next';
import { Fetcher } from 'swr';
import EventCard from './EventCard';

const fetcher: Fetcher<PaginatedSessionsResponse> = (url: string) => getAllSessions(url);

export default function Event() {
    const { t } = useTranslation();

    return (
        <div className="container">
            <EventCard fetcher={fetcher} title={t('event.title')} />
        </div>
    );
}
