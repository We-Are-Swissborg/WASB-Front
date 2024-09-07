import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Role from '../types/Role';

export default function Settings() {
    const [t, i18n] = useTranslation('global');
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const { roles } = useAuth();

    const handleChangeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <>
            <div className="dropdown">
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    id="navbarParams"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <i className={isHovering ? 'fa fa-spin fa-gear' : 'fa fa-gear'}></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-md-end" aria-labelledby="navbarParams">
                    <li>
                        <h6 className="dropdown-header">{t('nav.language')}</h6>
                    </li>
                    <li>
                        <button className="dropdown-item" onClick={() => handleChangeLanguage('en')}>
                            {t('header.en')}
                        </button>
                    </li>
                    <li>
                        <button className="dropdown-item" onClick={() => handleChangeLanguage('fr')}>
                            {t('header.fr')}
                        </button>
                    </li>
                    {roles?.includes(Role.Admin) && (
                        <>
                            <li>
                                <h6 className="dropdown-header">{t('nav.admin')}</h6>
                            </li>

                            <li>
                                <NavLink className="dropdown-item" to="/admin">
                                    {t('nav.admin')}
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </>
    );
}
