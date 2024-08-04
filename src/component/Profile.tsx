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
    const [choiceSetting, setChoiceSetting] = useState(1);
    const { token } = useAuth();
    const [user, setUser] = useState<User>();  

    const classNaV = (nav: number) => {
        let namesClass = 'bg-secondary-subtle text-black';
        if (nav === choiceSetting) return namesClass = 'btn-secondary text-white';

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
        <div className="setting-container container d-flex flex-column align-items-center mt-5">
            <h1 className="border-bottom border-dark-subtle pb-2 fw-bold w-100">{t('setting.title')}</h1>
            <div className="d-flex w-100">
                <div className="container-main-input">
                    <h2 className=" mb-3 fw-normal">{t('setting.title')}</h2>
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
                                    onClick={() => setChoiceSetting(1)}
                                />
                                {t('setting.my-account.title')}
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
                                    onClick={() => setChoiceSetting(2)}
                                />
                                {t('setting.manage-membership.title')}
                            </label>
                        </li>
                        <li className="mb-3">
                            <label
                                className={`btn bg-gradient rounded-pill border w-100 text-start text-nowrap ${classNaV(3)}`}
                                htmlFor="linked-accounts"
                            >
                                {t('setting.linked-accounts.title')}
                                <input
                                    type="button"
                                    name="linked-accounts"
                                    id="linked-accounts"
                                    onClick={() => setChoiceSetting(3)}
                                />
                            </label>
                        </li>
                        <li className="mb-3">
                            <label
                                className={`btn bg-gradient rounded-pill border w-100 text-start text-nowrap ${classNaV(4)}`}
                                htmlFor="donations"
                            >
                                Donations
                                <input
                                    type="button"
                                    name="donations"
                                    id="donations"
                                    onClick={() => setChoiceSetting(4)}
                                />
                            </label>
                        </li>
                    </ul>
                </div>
                {choiceSetting === 1 && (
                    <div className="w-100">
                        <h2 className="fw-normal">{t('setting.my-account.title')}</h2>
                        <AccountFom user={user} setUser={setUser} />
                    </div>
                )}
                {choiceSetting === 2 && (
                    <div className="w-100">
                        <div>
                            <h2 className="fw-normal">{t('setting.manage-membership.title')}</h2>
                            <p className="message-membership">{t('setting.manage-membership.message-1')}</p>
                            <p className="message-membership">{t('setting.manage-membership.message-2')}</p>
                        </div>
                        <MembershipForm membership={user?.membership} />
                    </div>
                )}
                {choiceSetting === 3 && (
                    <div className="w-100">
                        <h2 className="fw-normal">{t('setting.linked-accounts.title')}</h2>
                        <SocialMediasForm socialMedias={user?.socialMedias} setUser={setUser} user={user}/>
                    </div>
                )}
                {choiceSetting === 4 && (
                    <div>
                        <h2 className="fw-normal">DONATIONS</h2>
                        <div className="d-flex flex-column align-items-center mt-5 mb-5">
                            <p>Scannez le QR code ci-dessous pour faire un don et aider à faire grandir notre association. Chaque contribution compte et fait une réelle différence.</p>
                            <QRCode size={150} value="QR code for donation" />
                            <p>Wallet : 0x75581e...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}