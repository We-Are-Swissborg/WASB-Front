import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { UseAuth } from '../contexts/AuthContext';
import Role from '../types/Role';
import { AdminPanelSettingsTwoTone, SettingsTwoTone } from '@mui/icons-material';
import { gsap } from 'gsap';

export default function Settings() {
    const [t, i18n] = useTranslation();
    const { roles } = UseAuth();
    const iconRef = useRef(null);

    const handleChangeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const handleMouseEnter = () => {
        gsap.to(iconRef.current, { rotation: 360, duration: 1, repeat: -1, ease: 'linear' });
    };

    const handleMouseLeave = () => {
        gsap.killTweensOf(iconRef.current);
        gsap.to(iconRef.current, { rotation: 0, duration: 0.5 });
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
                    style={{ cursor: 'pointer' }}
                >
                    <SettingsTwoTone ref={iconRef} />
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
                                    <AdminPanelSettingsTwoTone /> {t('nav.admin')}
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </>
    );
}
