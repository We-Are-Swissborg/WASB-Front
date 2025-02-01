import { Container, Typography, Box } from '@mui/material';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BlockchainCity from '@/assets/images/blockchaincity.webp';

const AboutUs = () => {
    const { t } = useTranslation();
    const containerRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(containerRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 });
    }, []);

    return (
        <Container maxWidth="md" sx={{ py: 5 }} ref={containerRef}>
            <Box>
                <Typography variant="h3" gutterBottom fontWeight="bold" textAlign="center">
                    {t('about.title')}
                </Typography>
                <Typography gutterBottom textAlign="justify">
                    <Trans i18nKey="about.intro" components={{ strong: <strong />, u: <u /> }} />
                </Typography>
                <Typography gutterBottom textAlign="justify">
                    <Trans i18nKey="about.mission" components={{ u: <i /> }} />
                </Typography>
                <Typography gutterBottom textAlign="justify">
                    {t('about.values')}
                </Typography>

                <img
                    src={BlockchainCity}
                    alt="Blockchain City"
                    style={{ width: '100%', borderRadius: '8px', marginBottom: '20px', marginTop: '20px' }}
                />
            </Box>

            <Box mt={4}>
                <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
                    {t('about.whatWeDoTitle')}
                </Typography>
                <Typography>{t('about.whatWeDoIntro')}</Typography>
                <ul>
                    <li>
                        <Typography>{t('about.whatWeDoPoint1')}</Typography>
                    </li>
                    <li>
                        <Typography>{t('about.whatWeDoPoint2')}</Typography>
                    </li>
                    <li>
                        <Typography>{t('about.whatWeDoPoint3')}</Typography>
                    </li>
                </ul>
                <Typography gutterBottom textAlign="justify">
                    {t('about.legalNote')}
                </Typography>
            </Box>

            <Box mt={4}>
                <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
                    {t('about.visionTitle')}
                </Typography>
                <Typography gutterBottom textAlign="justify">
                    {t('about.visionIntro')}
                </Typography>
                <Typography gutterBottom textAlign="justify">
                    {t('about.visionConclusion')}
                </Typography>
            </Box>
        </Container>
    );
};

export default AboutUs;
