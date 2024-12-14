import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';

import gsap from 'gsap';

import swissborgmania from '../assets/images/swissborgmania.jpg';
import swissborgmania_banner from '../assets/images/swissborgmania_banner.jpg';

import '../css/Home.css';
import { ChevronRightTwoTone, Diversity3Sharp, PublicSharp, SchoolSharp, YouTube } from '@mui/icons-material';

export default function Home() {
    const [t] = useTranslation('global');
    const container = useRef(null);

    useGSAP(
        () => {
            gsap.from('.community', { duration: 1.5, stagger: 0.2, opacity: 0, y: 100 });
        },
        { scope: container },
    ); // <-- magic

    return (
        <>
            <div className="p-3 mb-4 bg-body-secondary">
                <div className="container py-3">
                    <h1 className="display-5 fw-bold text-center">{t('home.title')}</h1>
                    <p className="text-body-secondary fs-4 text-center">{t('home.subtitle')}</p>
                    <div className="text-center">
                        <a
                            href="#"
                            target="_blank"
                            className="btn btn-outline-primary bg-opacity-10 text-end"
                            type="button"
                        >
                            {t('common.join')} <ChevronRightTwoTone sx={{ fontSize: 21 }} />
                        </a>
                    </div>
                </div>
            </div>
            <div className="first-container container">
                <section className="mb-3">
                    <h2 className="text-center text-body-primary pb-4 h1 text-primary text-opacity-75">
                        {t('home.mission')}
                    </h2>
                    <div className="row row-cols-1 row-cols-lg-3 row-cols-md-1">
                        <div className="card border border-0 text-center">
                            <div className="card-header bg-transparent border-0">
                                <Diversity3Sharp sx={{ fontSize: 80 }}/>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{t('home.community')}</h5>
                            </div>
                        </div>
                        <div className="card border border-0 text-center">
                            <div className="card-header bg-transparent border-0">
                                <SchoolSharp sx={{ fontSize: 80 }}/>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{t('home.education')}</h5>
                            </div>
                        </div>
                        <div className="card border border-0 text-center">
                            <div className="card-header bg-transparent border-0">
                                <PublicSharp sx={{ fontSize: 80 }}/>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{t('home.democratization')}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="row row-cols-1 row-cols-lg-4 row-cols-md-2 mb-4">
                            <div className="col">
                                <div className="card text-bg-primary bg-gradient p-3 border rounded">
                                    <div className="card-body">
                                        <h5 className="card-title text-center m-0">{t('home.whoarewe')}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card text-bg-primary bg-gradient p-3 border rounded">
                                    <div className="card-body">
                                        <h5 className="card-title text-center m-0">{t('home.discoverswissborg')}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card text-bg-primary bg-gradient p-3 border rounded">
                                    <div className="card-body">
                                        <h5 className="card-title text-center m-0">{t('home.metrics')}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card text-bg-primary bg-gradient p-3 border rounded">
                                    <div className="card-body">
                                        <h5 className="card-title text-center m-0">{t('home.community')}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div>
                <div className="container">
                    <section ref={container} className="row justify-content-md-center py-5 mb-4">
                        <div className="col-lg-6 col-md-12 community align-center">
                            <article className="card text-body-secondary">
                                <div className="row g-0">
                                    <div className="col-lg-3 col-md-12 m-0 p-0">
                                        <img
                                            src={swissborgmania}
                                            className="img-fluid rounded-start d-none d-lg-block d-xl-block"
                                            alt="SwissBorgMania"
                                        />
                                    </div>
                                    <div className="col-lg-9 col-md-12 col-xs-4 d-flex flex-column justify-content-center align-items-center">
                                        <img
                                            src={swissborgmania_banner}
                                            className="card-img-top d-sm-block d-md-block d-lg-none d-xl-none"
                                            alt="SwissBorgMania on Youtube"
                                        />
                                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                                            <h5 className="card-title">{t('community.swissborgmania')}</h5>                                               
                                            {/* <p className="d-flex justify-content-center align-items-center"> */}
                                            <a
                                                href="https://www.youtube.com/@SwissBorgMania"
                                                target="_blank"
                                                className="text-danger"
                                            >
                                                <YouTube sx={{ fontSize: 80 }} />
                                            </a>
                                            {/* </p> */}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </section>
                </div>
            </div>
            <div className="container">
                <section className="row justify-content-center">
                    <article className="article-whoarewe col-8 p-4 text-center">
                        <h3 className="text-center h1 text-primary">{t('whoarewe.title')}</h3>
                        <p className="blockquote">{t('whoarewe.content')}</p>
                    </article>
                </section>
                <section className="row">
                    <article className="py-4">
                        <h3 className="col-12 text-center h1 text-primary text-opacity-75">{t('ourmission.title')}</h3>
                        <div className="row row-cols-1 row-cols-md-3 g-4 py-4">
                            <div className="col-md-6">
                                <div className="card h-100">
                                    <div className="card-header text-primary text-opacity-75">
                                        <h4>{t('ourmission.blockchain.title')}</h4>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">{t('ourmission.blockchain.content')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card h-100">
                                    <div className="card-header text-primary text-opacity-75">
                                        <h4>{t('ourmission.education.title')}</h4>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">{t('ourmission.education.content')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card h-100">
                                    <div className="card-header text-primary text-opacity-75">
                                        <h4>{t('ourmission.community.title')}</h4>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">{t('ourmission.community.content')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card h-100">
                                    <div className="card-header text-primary text-opacity-75">
                                        <h4>{t('ourmission.democratization.title')}</h4>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">{t('ourmission.democratization.content')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <aside>
                            <p className="blockquote">{t('ourmission.comment')}</p>
                        </aside>
                    </article>
                </section>
            </div>
        </>
    );
}
