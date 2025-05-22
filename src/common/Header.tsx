import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import logo from '../assets/images/Wasb_logo__blanc.png';

import '../css/Header.css';
import Settings from '../component/Settings.tsx';
import { UseAuth } from '../contexts/AuthContext.tsx';
import { ConnectButton } from '@/web3/ConnectButton.tsx';

export default function Header() {
    const { t } = useTranslation();
    const { isAuthenticated } = UseAuth();

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
                <div className="container d-flex justify-content-between">
                    <NavLink className="navbar-brand" to="/">
                        <img src={logo} className="logo-wasb" title="We are SwissBorg" alt="We are SwissBorg" />
                    </NavLink>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/">
                                    {t('nav.home')}
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/blog">
                                    {t('nav.blog')}
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/events">
                                    {t('nav.events')}
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/metrics">
                                    {t('nav.metrics')}
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/contact">
                                    {t('nav.contact')}
                                </NavLink>
                            </li>
                        </ul>
                        <div className="d-flex" role="connect">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                {isAuthenticated ? (
                                    <>
                                        <li className="nav-item">
                                            <NavLink className="nav-link" to="/profile">
                                                {t('nav.profile')}
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink className="nav-link" to="/logout">
                                                {t('nav.logout')}
                                            </NavLink>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="nav-item">
                                            <NavLink className="nav-link" to="/login">
                                                {t('nav.sign-in')}
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink className="nav-link" to="/register">
                                                {t('nav.sign-up')}
                                            </NavLink>
                                        </li>
                                    </>
                                )}
                                <ConnectButton className="btn btn-outline-secondary" />
                                <Settings />
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
