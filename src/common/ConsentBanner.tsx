import { useEffect } from 'react';
import '../css/ConsentBanner.css';
import { ConsentData, CookiePreferences } from '@/types/Analytics';
import { useTranslation } from 'react-i18next';
import useCookieConsent from '../hook/useCookieConsent';
import { loadConsent, updateGtagConsent } from '@/services/gtag.service';

export default function ConsentBanner() {
    const { t } = useTranslation();
    const {
        showBanner,
        showModal,
        preferences,
        setPreferences,
        setShowBanner,
        openPreferences,
        closeModal,
    } = useCookieConsent();

    useEffect(() => {
        const consentData = loadConsent();
        if(consentData && consentData.consented) {
            setPreferences(consentData.preferences);
            updateGtagConsent(consentData.preferences);
        } else {
            if(!showModal) setShowBanner(true)
        };
    }, [showBanner, showModal]);

    const saveConsent = (prefs: CookiePreferences, consented: boolean) => {
        const consentData: ConsentData = {
            consented,
            preferences: prefs,
            timestamp: new Date().toISOString(),
        };

        try {
            localStorage.setItem("wasb_consent", JSON.stringify(consentData));
            setPreferences(prefs);
            updateGtagConsent(prefs);
        } catch (e) {
            console.error('Failed to save consent:', e);
        }
    };

    const handleAcceptAll = () => {
        const allAccepted: CookiePreferences = {
            essential: true,
            analytics: true,
        };
        saveConsent(allAccepted, true);
        setShowBanner(false);
        closeModal();
    };

    const handleRejectAll = () => {
        const rejected: CookiePreferences = {
            essential: true, // Essential cookies cannot be disabled
            analytics: false,
        };
        saveConsent(rejected, true);
        setShowBanner(false);
        closeModal();
    };

    const handleSavePreferences = () => {
        saveConsent(preferences, true);
        closeModal();
    };

    const handleTogglePreference = (key: keyof CookiePreferences) => {
        if (key === 'essential') return; // Essential cannot be toggled
        setPreferences({...preferences, [key]: !preferences[key]});
    };

    if (!showBanner && !showModal) {
        return null;
    }

    return (
        <>
            {/* Consent Banner */}
            {showBanner && (
                <div className="consent-banner position-fixed z-100 bottom-0 w-100">
                    <div className="consent-banner-container bg-white">
                        <div className="consent-banner-content d-flex align-items-center justify-content-between flex-wrap">
                            <div className="consent-banner-text">
                                <h3 className="consent-title">{t('consent-banner.title')}</h3>
                                <p className="consent-description">{t('consent-banner.description')}</p>
                            </div>
                            <div className="consent-banner-actions d-flex flex-wrap align-items-center">
                                <button
                                    className="btn btn-primary bg-secondary text-light"
                                    onClick={handleAcceptAll}
                                    type="button"
                                >
                                    {t('consent-banner.accept')}
                                </button>
                                <button
                                    className="btn btn-secondary border border-dark bg-white"
                                    onClick={() => {
                                        setShowBanner(false);
                                        openPreferences(preferences);
                                    }}
                                    type="button"
                                >
                                    {t('consent-banner.customize')}
                                </button>
                                <button
                                    className="btn btn-tertiary bg-transparent text-body-tertiary border-0 text-decoration-underline"
                                    onClick={handleRejectAll}
                                    type="button"
                                >
                                    {t('consent-banner.reject')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cookie Preferences Modal */}
            {showModal && (
                <div className="cookie-modal z-101 position-fixed d-flex align-items-center justify-content-center top-0 w-100 h-100">
                    <div
                        className="cookie-modal-overlay position-absolute top-0 w-100 h-100 pe-auto"
                        onClick={() => closeModal()}
                        role="button"
                    />
                    <div className="cookie-modal-content position-relative bg-white rounded-4">
                        <div className="cookie-modal-header d-flex justify-content-between align-items-center">
                            <h2>{t('consent-banner.title')}</h2>
                            <button
                                className="close-btn bg-transparent border-0 pe-auto p-0 d-flex align-items-center justify-content-center rounded-5"
                                onClick={() => closeModal()}
                                type="button"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="cookie-modal-body">
                            <p className="cookie-intro">{t('consent-banner.modal.intro')}</p>

                            <div className="cookie-category">
                                <div className="cookie-category-header d-flex justify-content-between align-items-start">
                                    <div>
                                        <h3>{t('consent-banner.modal.essential')}</h3>
                                        <p>{t('consent-banner.modal.description-essential')}</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={preferences.essential}
                                            disabled
                                            readOnly
                                        />
                                        <span className="toggle-slider" />
                                    </label>
                                </div>
                            </div>

                            <div className="cookie-category">
                                <div className="cookie-category-header d-flex justify-content-between align-items-start">
                                    <div>
                                        <h3>{t('consent-banner.modal.analytics')}</h3>
                                        <p>{t('consent-banner.modal.description-analytics')}</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={preferences.analytics}
                                            onChange={() => handleTogglePreference('analytics')}
                                        />
                                        <span className="toggle-slider" />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="cookie-modal-footer">
                            <button
                                className="btn btn-primary"
                                onClick={handleSavePreferences}
                                type="button"
                            >
                                {t('consent-banner.modal.save')}
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={handleAcceptAll}
                                type="button"
                            >
                                {t('consent-banner.accept')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
