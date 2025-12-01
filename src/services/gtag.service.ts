import { ConsentData, CookiePreferences } from "@/types/Analytics";

// Update gtag consent
const updateGtagConsent = (preferences: CookiePreferences) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
            analytics_storage: preferences.analytics ? 'granted' : 'denied',
        });
    }
};

const loadConsent = (): ConsentData | null => {
    try {
        const stored = localStorage.getItem("wasb_consent");
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to load consent:", e);
    }
    return null;
};

export { updateGtagConsent, loadConsent }