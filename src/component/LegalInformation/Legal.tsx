import { NavLink } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import "../../css/Legal.css"

export default function Legal() {
    const { t } = useTranslation();

    return (
        <div>
            <h1 className="legal-title p-4 bg-body-secondary fw-bold">{t("legal.title")}</h1>
            <div className="legal-container mb-3">
                <p className="fst-italic block-structuration"><Trans i18nKey="legal.last-modification" components={[<strong />]} /></p>
                <div className="bg-body-secondary block-structuration">
                    <p>
                        <strong>{t("legal.association-name")}</strong><br />
                        <strong>UID / IDE : </strong><a href="https://www.zefix.ch/fr/search/entity/list/firm/1633666" target="_blank">CHE-134.074.959</a><br />
                        <Trans i18nKey="legal.non-profit" components={[<strong />]} /><br />
                        {t("legal.commercial-register")}<br />
                        <Trans i18nKey="legal.commercial-register-contact" components={[<strong />]} /><br />
                        <Trans i18nKey="legal.head-office" components={[<strong />]} /><br />
                        <strong>Email :</strong> weareswissborg@gmail.com<br />
                        <strong>{t("legal.hosting")}</strong> OVH – 2 rue Kellermann – 59100 Roubaix – France<br />
                    </p>
                </div>
                <p className="block-structuration">
                    <strong>{t("legal.committee")} :</strong><br />
                    &emsp;– Julien GRANDJANNY, {t("legal.president")}<br />
                    &emsp;– Etienne LEROY, {t("legal.vice-president")}<br />
                    &emsp;– Etienne LEROY, {t("legal.secretary")}<br />
                    &emsp;– Mickael BOLAND, {t("legal.treasurer")}<br />
                    {t("legal.signature")}
                </p>
                <div className="bg-body-secondary block-structuration">
                    <Trans i18nKey="legal.disclaimer" components={[<strong />]} />
                </div>
                <p className="block-structuration"><Trans i18nKey="legal.goal" components={[<strong />]} /></p>
                <div className="bg-body-secondary block-structuration">
                    <p>{t("legal.protection")} <NavLink to="/confidentiality">{t("legal.policy")}</NavLink>.</p>
                </div>
                <p className="block-structuration"><Trans i18nKey="legal.director" components={[<strong />]} /></p>
            </div>
        </div>
    );
}
