import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import logo from '../assets/images/Wasb_logo__blanc.png';

import '../css/Header.css';
import Settings from '../component/Settings.tsx';
import { UseAuth } from '../contexts/AuthContext.tsx';

export default function Header() {
    const { t } = useTranslation();
    const { isAuthenticated, roles } = UseAuth();
    const dataDropdown = {
        blog: [
            {
                name: t('nav.home'),
                path: '/blog',
            },
            {
                name: t('nav.create'),
                path: '/blog/create-post',
                acceptRole: ['author']

            },
            {
                name: t('nav.my-posts'),
                path: '/blog/my-posts',
                acceptRole: ['author']
            },
            {
                name: t('nav.to-validate'),
                path: '/blog/to-validate',
                acceptRole: ['author', 'editor']
            },
        ],
        events: [
            {
                name: t('nav.home'),
                path: '/events'
            },
            {
                name: t('nav.my-events'),
                path: '/events/my-events',
                acceptRole: ['organizer']
            },
            {
                name: t('nav.create'),
                path: '/events/create-event',
                acceptRole: ['organizer']
            },
        ],
    }

    const dropdown = (nameButton: string, listNav: Array<{name: string, path: string, acceptRole?: string[]}>, idButton: number) => {
        let idMenu = 0;
        return (
            <>
                <NavLink className="nav-link dropdown-toggle" key={'button-header-'+idButton} id={'button-header-'+idButton} to={`${listNav[0].path}`} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {nameButton}
                </NavLink>
                <ul className="dropdown-menu" aria-labelledby={'button-header-'+idButton}>
                    {listNav.map((nav) => {
                        let isInDropdown = false;
                        nav.acceptRole?.forEach((role) => roles?.includes(role) && (isInDropdown = true));
                        if(isInDropdown || !nav.acceptRole) {
                            idMenu++;
                            return (
                                <li className='header-menu-item' key={"header-menu-item-"+idMenu}>
                                    <NavLink className="nav-link dropdown-item" to={nav.path} end>
                                        {nav.name}
                                    </NavLink>
                                </li>
                            )
                        }
                    })}
                </ul>
            </>
        );
    }

    const getIdButton = (mainPath: string) => {
        const propsDataDropdown = Object.keys(dataDropdown);
        let idButton = undefined;
        idButton = propsDataDropdown.findIndex((prop) => mainPath.includes(prop));

        return idButton;
    } 

    const displayButtonOrDropdown = (nameButton: string, listNav: Array<{name: string, path: string, acceptRole?: string[]}>) => {
        let displayButton = true;
        let roleToDisplayDropdown: string[] = [];
        const mainPath = listNav[0].path;
        const idButton: number | undefined = getIdButton(mainPath);

        listNav.forEach(data => data.acceptRole && (roleToDisplayDropdown = roleToDisplayDropdown.concat(data.acceptRole)));
        const setRoleToDisplayDropdown = new Set(roleToDisplayDropdown);

        let withoutDuplicateRole = [...setRoleToDisplayDropdown];
        withoutDuplicateRole.forEach((role) => displayButton = !roles?.includes(role));
        if(displayButton) {
            return (
                <NavLink className="nav-link dropdown-item" key={'nav-header-'+idButton} to={mainPath} end>
                    {nameButton}
                </NavLink>
            )
        }

       return dropdown(nameButton, listNav, idButton);
    }

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
                            <li className="nav-item dropdown">
                                {displayButtonOrDropdown(t('nav.blog'), dataDropdown.blog)}
                            </li>
                            <li className="nav-item dropdown">
                                {displayButtonOrDropdown(t('nav.events'), dataDropdown.events)}
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
                            {/* <TernoaConnect /> */}
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
                            </ul>
                        </div>
                        <Settings />
                    </div>
                </div>
            </nav>
        </header>
    );
}
