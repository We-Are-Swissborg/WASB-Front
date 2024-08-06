import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User } from "../types/User";
import { getUserWithAllInfo } from '../services/user.service';
import { tokenDecoded } from '../services/token.services';
import AccountFom from './Form/AccountForm';
import MembershipForm from './Form/MembershipForm';
import SocialMediasForm from './Form/SocialMediasForm';
import '../css/Profile.css';
import QRCode from "react-qr-code";

export default function Profile() {
    const { t } = useTranslation('global');
    const [profileCategory, setProfileCategory] = useState(1);
    const { token } = useAuth();
    const [user, setUser] = useState<User>();  

    const classNaV = (nav: number) => {
        let namesClass = 'bg-secondary-subtle text-black';
        if (nav === profileCategory) return namesClass = 'btn-secondary text-white';

        return namesClass;
    };

    const initUser = useCallback(() => {
        if(token) {
            const { userId } = tokenDecoded(token);
            getUserWithAllInfo(userId, token).then((user) => setUser(user));
        }
    }, [token]);

    useEffect(() => {
        initUser();
    }, [initUser]);

    return (
        <div className="profile-container container d-flex flex-column align-items-center mt-5">
            <h1 className="border-bottom border-dark-subtle pb-2 fw-bold w-100">{t('profile.title')}</h1>
            <div className="d-flex w-100">
                <div className="container-main-input">
                    <h2 className=" mb-3 fw-normal">{t('profile.title')}</h2>
                    <ul className="list-inline d-flex flex-column justify-content-between">
                        <li className="mb-3">
                            <label
                                className={`btn bg-gradient rounded-pill border w-100 text-start text-nowrap ${classNaV(1)}`}
                                htmlFor="my-account"
                            >
                                <input
                                    type="button"
                                    name="my-account"
                                    id="my-account"
                                    onClick={() => setProfileCategory(1)}
                                />
                                {t('profile.my-account.title')}
                            </label>
                        </li>
                        <li className="mb-3">
                            <label
                                className={`btn bg-gradient rounded-pill border w-100 text-start text-nowrap ${classNaV(2)}`}
                                htmlFor="manage-membership"
                            >
                                <input
                                    type="button"
                                    name="manage-membership"
                                    id="manage-membership"
                                    onClick={() => setProfileCategory(2)}
                                />
                                {t('profile.manage-membership.title')}
                            </label>
                        </li>
                        <li className="mb-3">
                            <label
                                className={`btn bg-gradient rounded-pill border w-100 text-start text-nowrap ${classNaV(3)}`}
                                htmlFor="social-medias"
                            >
                                {t('profile.social-medias.title')}
                                <input
                                    type="button"
                                    name="social-medias"
                                    id="social-medias"
                                    onClick={() => setProfileCategory(3)}
                                />
                            </label>
                        </li>
                        <li className="mb-3">
                            <label
                                className={`btn bg-gradient rounded-pill border w-100 text-start text-nowrap ${classNaV(4)}`}
                                htmlFor="donations"
                            >
                                {t('profile.donations.title')}
                                <input
                                    type="button"
                                    name="donations"
                                    id="donations"
                                    onClick={() => setProfileCategory(4)}
                                />
                            </label>
                        </li>
                    </ul>
                </div>
                {profileCategory === 1 && (
                    <div className="w-100">
                        <h2 className="fw-normal">{t('profile.my-account.title')}</h2>
                        <AccountFom user={user} setUser={setUser} />
                    </div>
                )}
                {profileCategory === 2 && (
                    <div className="w-100">
                        <div>
                            <h2 className="fw-normal">{t('profile.manage-membership.title')}</h2>
                            <p className="message-membership">{t('profile.manage-membership.message-1')}</p>
                            <p className="message-membership">{t('profile.manage-membership.message-2')}</p>
                        </div>
                        <MembershipForm membership={user?.membership} />
                    </div>
                )}
                {profileCategory === 3 && (
                    <div className="w-100">
                        <h2 className="fw-normal">{t('profile.social-medias.title')}</h2>
                        <SocialMediasForm socialMedias={user?.socialMedias} setUser={setUser} user={user}/>
                    </div>
                )}
                {profileCategory === 4 && (
                    <div className="w-100">
                        <h2 className="fw-normal">{t('profile.donations.title')}</h2>
                        <div className="d-flex flex-column align-items-center mt-5 mb-5">
                            <p className="align-self-start">{t('profile.donations.message')}</p>
                            <QRCode size={150} value={t('profile.donations.qr-code')} />
                            <p>Wallet : 0x75581e...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}