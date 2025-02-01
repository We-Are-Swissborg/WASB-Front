import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Button, Chip, Grid2 } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Session as SessionType } from '@/types/Session';
import useSWR, { Fetcher } from 'swr';
import { getSessionBySlug } from '@/services/session.service';
import { CalendarMonthSharp } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import imageDefault from '../../assets/images/event_default.png';

const fetcher: Fetcher<SessionType> = (url: string) => getSessionBySlug(url);

export default function Session() {
    const { t } = useTranslation('global');
    const { slug } = useParams();
    const [session, setSession] = useState<SessionType>();

    const { data, error, isLoading } = useSWR<SessionType>(`sessions/${slug}`, fetcher, {
        revalidateOnFocus: false,
    });

    const optionDate: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };

    useEffect(() => {
        setSession(data);
    }, [data]);

    if (isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Box sx={{ padding: 4 }}>
                        <Typography variant="h4">{t('common.loading')}</Typography>
                    </Box>
                </div>
            </div>
        );
    }

    if (!session || error) {
        return (
            <div className="container">
                <div className="row">
                    <Box sx={{ padding: 4 }}>
                        <Typography variant="h4">{t('event.loading-error')}</Typography>
                    </Box>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="row">
                <Box sx={{ padding: 4 }}>
                    <Box sx={{ marginBottom: 4 }}>
                        <Typography variant="h3" gutterBottom>
                            {session.title}
                        </Typography>
                    </Box>
                    <Grid2 container spacing={4}>
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                }}
                            >
                                {session.status === 'Cancelled' && (
                                    <Chip
                                        label="Annulé"
                                        color="error"
                                        sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}
                                    />
                                )}
                                <CardMedia
                                    component="img"
                                    image={session.image64}
                                    src={imageDefault}
                                    alt={session.title}
                                    sx={{ maxHeight: 400 }}
                                />
                            </Card>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
                            <Box sx={{ marginBottom: 4 }}>
                                <Typography variant="h4" gutterBottom>
                                    {t('event.datetime')} :
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <CalendarMonthSharp />{' '}
                                    {new Date(session.startDateTime).toLocaleString(
                                        `${t('blog.localCode')}`,
                                        optionDate,
                                    )}
                                    {session.endDateTime &&
                                        ` - ${new Date(session.endDateTime).toLocaleString(
                                            `${t('blog.localCode')}`,
                                            optionDate,
                                        )}`}
                                </Typography>
                                {session.address && (
                                    <Typography variant="h4" gutterBottom>
                                        {t('event.locality')} :
                                    </Typography>
                                )}

                                {session.organizerBy && (
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {t('event.organizer')} : {session.organizerBy.username}
                                    </Typography>
                                )}
                                {session.url && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        href={session.url}
                                        target="_blank"
                                        sx={{ marginTop: 2 }}
                                    >
                                        {t('event.url')}
                                    </Button>
                                )}
                            </Box>
                        </Grid2>
                    </Grid2>
                    <Grid2 container>
                        <CardContent sx={{ marginBottom: 4 }}>
                            <Typography variant="h4" gutterBottom sx={{ marginBottom: 4 }}>
                                {t('event.about')} :
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <div dangerouslySetInnerHTML={{ __html: session.description }} />
                            </Typography>
                        </CardContent>
                    </Grid2>
                </Box>
            </div>
        </div>
    );
}
