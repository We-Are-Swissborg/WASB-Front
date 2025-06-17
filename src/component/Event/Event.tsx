import { getAllSessions } from '@/services/session.service';
import { CardSession, PaginatedSessionsResponse } from '@/types/Session';
import { CalendarMonthSharp } from '@mui/icons-material';
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Button,
    Pagination,
    Grid,
    CardActions,
    Chip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import useSWR, { Fetcher, mutate } from 'swr';
import imageDefault from '../../assets/images/event_default.png';
import { UseAuth } from '@/contexts/AuthContext';

const fetcher: Fetcher<PaginatedSessionsResponse> = (url: string) => getAllSessions(url);

export default function Event() {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [limit] = useState<number>(9);
    // const [filter, setFilter] = useState('');
    const { data, error, isLoading } = useSWR<PaginatedSessionsResponse>(
        `sessions?page=${currentPage}&limit=${limit}`,
        fetcher,
        {
            revalidateOnFocus: false,
        },
    );
    const [sessions, setSessions] = useState<CardSession[]>([]);

    const optionDate: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };

    useEffect(() => {
        if (data) {
            setSessions(data.sessions);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
        }
    }, [data]);

    // const handleFilterChange = (e) => {
    //     setFilter(e.target.value);
    //     setCurrentPage(1);
    // };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
        mutate(`/sessions?page=${value}&limit=${limit}`);
    };

    if (error) return <div>{t('blog.loading-error')}</div>;

    return (
        <div className="container">
            <Box sx={{ padding: 4 }}>
                <div className='d-flex align-items-center justify-content-between mb-4'>
                    <Typography variant="h4">
                        {t('event.title')}
                    </Typography>
                    {/* Filter and Search Bar 
                    <Box sx={{ marginBottom: 4, display: 'flex', justifyContent: 'center' }}>
                        <TextField
                            label={t('event.search')}
                            variant="outlined"
                            fullWidth
                            value={filter}
                            onChange={handleFilterChange}
                        />
                    </Box>
                    */}
                </div>

                {isLoading ? (
                    <Grid container spacing={4}>
                        {[...Array(6)].map((_, index) => (
                            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                <Card
                                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                    aria-hidden="true"
                                >
                                    <CardMedia component="div" sx={{ height: 285, backgroundColor: '#e0e0e0' }} />
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            <span
                                                style={{
                                                    display: 'block',
                                                    height: '1.5rem',
                                                    backgroundColor: '#e0e0e0',
                                                    width: '60%',
                                                }}
                                            ></span>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <span
                                                style={{
                                                    display: 'block',
                                                    height: '1rem',
                                                    backgroundColor: '#e0e0e0',
                                                    width: '80%',
                                                }}
                                            ></span>
                                            <span
                                                style={{
                                                    display: 'block',
                                                    height: '1rem',
                                                    backgroundColor: '#e0e0e0',
                                                    width: '40%',
                                                    marginTop: '0.5rem',
                                                }}
                                            ></span>
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            sx={{ backgroundColor: '#e0e0e0', width: '60%', height: '2rem' }}
                                            disabled
                                        ></Button>
                                        <Button
                                            size="small"
                                            sx={{ backgroundColor: '#e0e0e0', width: '60%', height: '2rem' }}
                                            disabled
                                        ></Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Grid container spacing={4}>
                        {sessions.map((session) => (
                            <Grid key={session.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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
                                            label={t('event.cancelled')}
                                            color="error"
                                            sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}
                                        />
                                    )}
                                    <CardMedia
                                        component="img"
                                        image={session.image64}
                                        src={imageDefault}
                                        alt={session.title}
                                        height="285"
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" gutterBottom>
                                            {session.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                                            <CalendarMonthSharp />{' '}
                                            {new Date(session.startDateTime).toLocaleString(
                                                `${t('blog.localCode')}`,
                                                optionDate,
                                            )}
                                        </Typography>
                                        {session.endDateTime && (
                                            <Typography variant="body2" color="text.secondary">
                                                <CalendarMonthSharp />{' '}
                                                {new Date(session.endDateTime).toLocaleString(
                                                    `${t('blog.localCode')}`,
                                                    optionDate,
                                                )}
                                            </Typography>
                                        )}
                                        <NavLink
                                            color="primary"
                                            to={`/events/${session.slug}`}
                                            className={'btn btn-secondary'}
                                        >
                                            {t('event.details')}
                                        </NavLink>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {!isLoading && (
                    <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            variant="outlined"
                        />
                    </Box>
                )}
            </Box>
        </div>
    );
}
