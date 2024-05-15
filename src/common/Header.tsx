import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import TernoaConnect from "../web3/ternoaConnect.tsx";
import logo from '../assets/images/Wasb_logo__blanc.png';

import '../css/Header.css';

export default function Header () {
    const [t, i18n] = useTranslation("global");
    const [isHovering, setIsHovering] = useState<boolean>(false);

    const handleChangeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("language", lang);
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
                <div className="container d-flex justify-content-between">
                    <a className="navbar-brand" href="#">
                        <img src={logo} className="logo-wasb" alt="We are SwissBorg"/>
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/">{t("nav.home")}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/blog">{t("nav.blog")}</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/contact">{t("nav.contact")}</NavLink>
                            </li>
                        </ul>
                        <div className="d-flex" role="connect">
                            <TernoaConnect />
                        </div>
                        <div className="dropdown">
                            <button type="button" className="btn btn-outline-secondary" id="navbarParams" role="button" data-bs-toggle="dropdown" aria-expanded="false"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}>
                                <i className={isHovering ? 'fa fa-spin fa-gear' : 'fa fa-gear'}></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-md-end" aria-labelledby="navbarParams">
                                <li><h6 className="dropdown-header">{t("nav.language")}</h6></li>
                                <li><button className="dropdown-item" onClick={() => handleChangeLanguage('en')}>English</button></li>
                                <li><button className="dropdown-item" onClick={() => handleChangeLanguage('fr')}>Français</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
