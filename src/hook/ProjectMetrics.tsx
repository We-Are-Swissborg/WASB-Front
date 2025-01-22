import { Public, X, Telegram } from '@mui/icons-material';
import DiscordIcon from '../common/icons/DiscordIcon';
import { useTranslation } from 'react-i18next';

function BorgyTelegramLink() {
    const { t } = useTranslation('global');

    return (
        <a href={t('metrics.borgy-telegram')} target="_blank">
            <Telegram />
        </a>
    );
}

const project: Record<string, Record<'name', string>> &
    Record<string, Record<'medias', Record<string, React.ReactElement>>> = {
    borg: {
        name: 'Swissborg',
        medias: {
            site: (
                <a href="https://swissborg.com/" target="_blank">
                    <Public />
                </a>
            ),
            twitter: (
                <a href="https://x.com/swissborg" target="_blank">
                    <X />
                </a>
            ),
            discord: (
                <a href="https://discord.com/invite/swissborg" target="_blank">
                    <DiscordIcon />
                </a>
            ),
            telegram: (
                <a href="https://t.me/SwissBorgChat" target="_blank">
                    <Telegram />
                </a>
            ),
        },
    },
    btc: {
        name: 'Bitcoin',
        medias: {
            site: (
                <a href="https://bitcoin.org/en/" target="_blank">
                    <Public />
                </a>
            ),
        },
    },
    xbg: {
        name: 'XBorg',
        medias: {
            site: (
                <a href="https://www.xborg.com/" target="_blank">
                    <Public />
                </a>
            ),
            twitter: (
                <a href="https://x.com/XBorgHQ" target="_blank">
                    <X />
                </a>
            ),
            discord: (
                <a href="https://discord.com/invite/xborg" target="_blank">
                    <DiscordIcon />
                </a>
            ),
        },
    },
    borgy: {
        name: 'Borgy',
        medias: {
            site: (
                <a href="https://borgysol.com/" target="_blank">
                    <Public />
                </a>
            ),
            twitter: (
                <a href="https://x.com/borgysol" target="_blank">
                    <X />
                </a>
            ),
            telegram: <BorgyTelegramLink />,
        },
    },
};

export default project;
