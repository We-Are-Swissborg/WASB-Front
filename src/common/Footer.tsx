import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import '../css/Footer.css';
import { Facebook, X, YouTube } from '@mui/icons-material';

export default function Footer() {
    const [t] = useTranslation('global');

    return (
        <footer className="text-muted py-5 bg-primary">
            <div className="container">
                <p className="mb-3">{t('footer.message')}</p>
                <div className="row">
                    <div className="col-6 col-md-2 mb-3">
                        <h5>{t('footer.subtitle')}</h5>
                        <ul className="nav flex-column">
                            <li className="nav-item mb-2">
                                <a href="#" className="nav-link p-0 link-light">
                                    {t('footer.whoarewe')}
                                </a>
                            </li>
                            <li className="nav-item mb-2">
                                <a href="#" className="nav-link p-0 link-light">
                                    {t('footer.team')}
                                </a>
                            </li>
                            <li className="nav-item mb-2">
                                <NavLink className="nav-link p-0 link-light" to="/contact">
                                    {t('footer.contact')}
                                </NavLink>
                            </li>
                            <li className="nav-item mb-2">
                                <a href="#" className="nav-link p-0 link-light">
                                    {t('footer.donation')}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="col  mb-3">
                        <h5>{t('footer.join')}</h5>
                        <ul className="list-group list-group-horizontal">
                            <li className="list-group-item">
                                <a href="#">
                                    <X sx={{fontSize: 30}} />
                                </a>
                            </li>                            
                            <li className="list-group-item">
                                <a href="#">
                                    <YouTube sx={{fontSize: 30}} />
                                </a>
                            </li>
                            <li className="list-group-item">
                                <a href="#">
                                    <Facebook sx={{fontSize: 30}} />
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-5 offset-md-1 mb-3">
                        <h5>{t('footer.subscribe.title')}</h5>
                        <form>
                            <p>{t('footer.subscribe.message')}</p>
                            <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                                <label htmlFor="newsletter1" className="visually-hidden">
                                    {t('footer.subscribe.placeholder')}
                                </label>
                                <input
                                    id="newsletter1"
                                    type="text"
                                    className="form-control rounded-pill"
                                    placeholder={t('footer.subscribe.placeholder')}
                                    disabled
                                />
                                <button
                                    className="btn bg-gradient rounded-pill border border-secondary text-white"
                                    type="button"
                                    disabled
                                >
                                    {t('footer.subscribe.button')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
                    <p>© 2024 WeAreSwissborg, Inc. {t('footer.rights-reserved')}</p>
                    <ul className="list-unstyled d-flex">
                        <li className="ms-3">
                            <a className="link-light" href="#">
                                <X />
                            </a>
                        </li>
                        <li className="ms-3">
                            <a className="link-light" href="#">
                                <YouTube />
                            </a>
                        </li>
                        <li className="ms-3">
                            <a className="link-light" href="#">
                                <Facebook />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
