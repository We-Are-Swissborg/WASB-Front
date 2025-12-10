import { NavLink } from "react-router-dom";
import { loadConsent } from "@/services/gtag.service";
import useCookieConsent from "@/hook/useCookieConsent";
import { Trans, useTranslation } from "react-i18next";

export default function Confidentiality() {
    const { t } = useTranslation()

    const showModal = () => {
        const consent = loadConsent();
        useCookieConsent.getState().openPreferences(consent?.preferences ?? {
            essential: true,
            analytics: false
        });
    }

    return (
        <div className="container py-5">
            <h1 className="fw-bold mb-4">{t("confidentiality.title")}</h1>
            <p className="fst-italic mb-4"><Trans i18nKey="confidentiality.last-modification" components={[<strong />]} /></p>

            <div className="row mb-5">
                <div className="col-lg-10">
                    <p className="lead">
                        <Trans i18nKey="confidentiality.welcome" components={[<strong />]} />
                    </p>
                    <p>
                        {t("confidentiality.intro")}
                    </p>
                </div>
            </div>

            <h2 className="h3 fw-semibold mt-5 mb-4">1. {t("confidentiality.controller-title")}</h2>
            <div className="card mb-5">
                <div className="card-body">
                    <p className="mb-1"><strong>WeAreSwissBorg</strong></p>
                    <p className="mb-1">{t("confidentiality.controller-name")}</p>
                    <p className="mb-1">UID : CHE-134.074.959 ({t("confidentiality.controller-register")})</p>
                    <p className="mb-1">{t("confidentiality.controller-address")}</p>
                    <p className="mb-1">Email : weareswissborg@gmail.com</p>
                    <p className="mb-0">{t("confidentiality.controller-president")} : Julien GRANDJANNY</p>
                </div>
            </div>

            <h2 className="h3 fw-semibold mb-4">2. {t("confidentiality.data-collected-title")}</h2>

            <h3 className="h5 fw-medium mb-3">a) {t("confidentiality.data-collected-forms")}</h3>
            <ul className="list-group list-group-flush mb-5">
                <li className="list-group-item"><Trans i18nKey="confidentiality.data-collected-list" components={[<strong />]} /></li>
                <li className="list-group-item"><Trans i18nKey="confidentiality.data-collected-optional" components={[<strong />]} /></li>
                <li className="list-group-item"><Trans i18nKey="confidentiality.purpose-forms" components={[<strong />]} /></li>
                <li className="list-group-item"><Trans i18nKey="confidentiality.legal-basis-forms" components={[<strong />]} /></li>
                <li className="list-group-item"><Trans i18nKey="confidentiality.retention-forms" components={[<strong />]} /></li>
                <li className="list-group-item"><Trans i18nKey="confidentiality.recipients-forms" components={[<strong />]} /></li>
            </ul>

            <h3 className="h5 fw-medium mb-3">b) Via Google Analytics ({t("confidentiality.analytics-title")})</h3>
            <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item"><Trans i18nKey="confidentiality.analytics-data" components={[<strong />]} /></li>
                <li className="list-group-item"><Trans i18nKey="confidentiality.analytics-purpose" components={[<strong />]} /></li>
                <li className="list-group-item"><Trans i18nKey="confidentiality.analytics-legal-basis" components={[<strong />]} /></li>
                <li className="list-group-item"><Trans i18nKey="confidentiality.analytics-retention" components={[<strong />]} /></li>
                <li className="list-group-item"><Trans i18nKey="confidentiality.analytics-recipient" components={[<strong />]} /></li>
            </ul>

            <div className="alert alert-warning" role="alert">
                <strong>Important :</strong> {t("confidentiality.no-crypto-data")}
            </div>

            <h2 className="h3 fw-semibold mt-5 mb-4">3. {t("confidentiality.rights-title")}</h2>
            <p>{t("confidentiality.rights-intro")}</p>
            <ul className="list-unstyled mb-4">
                <li className="mb-2">&emsp;- {t("confidentiality.right-access")}</li>
                <li className="mb-2">&emsp;- {t("confidentiality.right-restriction")}</li>
                <li className="mb-2">&emsp;- {t("confidentiality.right-withdraw")}</li>
                <li className="mb-2">&emsp;- {t("confidentiality.right-portability")}</li>
            </ul>
            <p className="mb-5">
                {t("confidentiality.rights-contact.first")} <a href="mailto:weareswissborg@gmail.com">weareswissborg@gmail.com</a> {t("confidentiality.rights-contact.second")}
            </p>

            <h2 className="h3 fw-semibold mb-4">4. {t("confidentiality.cookies-title")}</h2>

            <div className="table-responsive mb-4">
                <table className="table table-bordered table-striped">
                <thead className="table-light">
                    <tr>
                        <th>Cookie</th>
                        <th>{t("confidentiality.cookies-purpose-title")}</th>
                        <th>{t("confidentiality.cookies-duration-title")}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{t("confidentiality.cookie-session")}</td>
                        <td>{t("confidentiality.cookie-session-purpose")}</td>
                        <td>{t("confidentiality.cookie-session-duration")}</td>
                    </tr>
                    <tr>
                        <td>_ga, _gid, _ga_XXXXXXX</td>
                        <td>{t("confidentiality.cookie-analytics")} (Google Analytics)</td>
                        <td>{t("confidentiality.years")}</td>
                    </tr>
                </tbody>
                </table>
            </div>

            <p className="mb-4">{t("confidentiality.no-tracking")}</p>
            <p className="mb-4">
                <strong>Consentement :</strong> {t("confidentiality.banner-info")}
            </p>
            <button
                type="button"
                onClick={() => showModal()}
                className="btn btn-primary mb-5"
            >
                {t("confidentiality.manage-preferences")}
            </button>
            <h2 className="h3 fw-semibold mb-4">5. {t("confidentiality.security-title")}</h2>
            <p className="mb-5">
                {t("confidentiality.security-details")}
            </p>

            <h2 className="h3 fw-semibold mb-4">6. {t("confidentiality.contact-title")}</h2>
            <p className="mb-5">
                {t("confidentiality.contact-email")} <a href="mailto:weareswissborg@gmail.com">weareswissborg@gmail.com</a><br />
                {t("confidentiality.policy-updates")}<br /><br />
                © 2025 WeAreSwissBorg – {t("confidentiality.footer-copyright")}<br />
                <NavLink to="/legal" className="text-decoration-underline">{t("confidentiality.footer-legal")}</NavLink>
            </p>
        </div>
    );
}
