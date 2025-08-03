import { getMySessions } from '@/services/session.service';
import EventCard from './EventCard';
import { useTranslation } from 'react-i18next';
import { UseAuth } from '@/contexts/AuthContext';
import { tokenDecoded } from '@/services/token.services';

type IFetcher = [string, string, () => void];

const fetcher = ([url, token, setToken]: IFetcher) => getMySessions(url, token, setToken);

export default function MyEvent() {
    const { t } = useTranslation();
    const { token } = UseAuth();
    const userId = tokenDecoded(token!).userId;

    return (
        <div className="container">
            <EventCard fetcher={fetcher} title={t('my-event.title')} userId={userId} />
        </div>
    );
}
