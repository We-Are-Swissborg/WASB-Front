import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';

import gsap from "gsap";

import swissborgmania from '../assets/images/swissborgmania.jpg';
import thecryptophil from '../assets/images/thecryptophil.jpg';

import '../css/Home.css';

export default function Home() {
    const [t] = useTranslation("global");
    const container = useRef(null);

    useGSAP(() => {
        gsap.from(".community",  {duration: 1.5, stagger: 0.2,  opacity: 0, y: 100});
    }, { scope: container }); // <-- magic

    return (
        <>
            <div className="p-3 mb-4 bg-body-secondary">
                <div className="container py-3">
                    <h1 className="display-5 fw-bold text-center">{t("home.title")}</h1>
                    <p className="text-body-secondary fs-4 text-center" >{t("home.subtitle")}</p>
                    <div className='text-center'>
                        <a href="#" target='_blank' className="btn btn-outline-primary bg-opacity-10 text-end" type="button">{t("common.join")} <i className='fa fa-chevron-right'></i></a>
                    </div>
                </div>
            </div>
            <div className='first-container container'>
                <section className="row mb-3">
                    <h2 className="text-center text-body-primary pb-4 h1 text-primary text-opacity-75">{t("home.mission")}</h2>
                    <div className="card-group">
                        <div className="card border border-0">
                            <i className="fa-solid fa-people-group fa-4x text-center"></i>
                            <div className="card-body">
                                <h5 className="card-title text-center">{t("home.community")}</h5>
                            </div>
                        </div>
                        <div className="card border border-0">
                            <i className="fa-solid fa-graduation-cap fa-4x text-center"></i>
                            <div className="card-body">
                                <h5 className="card-title text-center">{t("home.education")}</h5>
                            </div>
                        </div>
                        <div className="card border border-0">
                            <i className="fa-solid fa-globe fa-4x text-center"></i>
                            <div className="card-body">
                                <h5 className="card-title text-center">{t("home.democratization")}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col mt-4">
                        <div className="row row-cols-1 row-cols-md-4 mb-4">
                            <div className="col">
                                <div className="card text-bg-primary bg-gradient p-3 border rounded">
                                    <div className="card-body">
                                        <h5 className="card-title text-center">{t("home.whoarewe")}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card text-bg-primary bg-gradient p-3 border rounded">
                                    <div className="card-body">
                                        <h5 className="card-title text-center">{t("home.discoverswissborg")}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card text-bg-primary bg-gradient p-3 border rounded">
                                    <div className="card-body">
                                        <h5 className="card-title text-center">{t("home.metrics")}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card text-bg-primary bg-gradient p-3 border rounded">
                                    <div className="card-body">
                                        <h5 className="card-title text-center">{t("home.community")}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div>
                <div className='container'>
                    <section ref={container} className="row row-cols-2 row-cols-md-2 py-5 mb-4" >
                        <div className="col community">
                            <article className="card text-body-secondary">
                                <div className="row g-0">
                                    <div className="col-md-4 m-0 p-0">
                                        <img src={swissborgmania} className="img-fluid rounded-start" alt="SwissBorgMania"/>
                                    </div>
                                    <div className="col-md-8 col-xs-4">
                                        <div className="card-body ">
                                            <h5 className="card-title text-center">{t("community.swissborgmania")}</h5>
                                            <p className="text-center">
                                                <a href="https://www.youtube.com/@SwissBorgMania" target="_blank" className="text-danger"><i className="fa-brands fa-youtube fa-5x"></i></a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                        <div className="col community">
                            <article className="card text-body-secondary">
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        <img src={thecryptophil} className="img-fluid rounded-start" alt="TheCryptoPhil"/>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title text-center">{t("community.thecryptophil")}</h5>
                                            <p className="text-center">
                                                <a href="https://discord.gg/swissborg" target="_blank" ><i className="fa-brands fa-discord fa-5x"></i></a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </section>
                </div>
            </div>
            <div className='container'>
                <section className="row justify-content-center">
                    <article className='article-whoarewe col-8 p-4 text-center'>
                        <h3 className='text-center h1 text-primary'>{t("whoarewe.title")}</h3>
                        <p className='blockquote'>{t("whoarewe.content")}</p>
                    </article>
                </section>
                <section className="row">
                    <article className='py-4'>
                        <h3 className='col-12 text-center h1 text-primary text-opacity-75'>{t("ourmission.title")}</h3>
                        <div className="row row-cols-1 row-cols-md-3 g-4 py-4">
                            <div className="col-md-6">
                                <div className="card h-100">
                                    <div className='card-header text-primary text-opacity-75'><h4>{t("ourmission.blockchain.title")}</h4></div>
                                    <div className="card-body">
                                        <p className="card-text">{t("ourmission.blockchain.content")}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card h-100">
                                    <div className='card-header text-primary text-opacity-75'><h4>{t("ourmission.education.title")}</h4></div>
                                    <div className="card-body">
                                        <p className="card-text">{t("ourmission.education.content")}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card h-100">
                                    <div className='card-header text-primary text-opacity-75'><h4>{t("ourmission.community.title")}</h4></div>
                                    <div className="card-body">
                                        <p className="card-text">{t("ourmission.community.content")}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card h-100">
                                    <div className='card-header text-primary text-opacity-75'><h4>{t("ourmission.democratization.title")}</h4></div>
                                    <div className="card-body">
                                        <p className="card-text">{t("ourmission.democratization.content")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <aside><p className='blockquote'>{t("ourmission.comment")}</p></aside>
                    </article>
                </section>
            </div>
        </>
    );
}