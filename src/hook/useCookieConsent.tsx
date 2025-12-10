import { CookiePreferences } from '@/types/Analytics';
import { create } from 'zustand';

type CookieConsentStore = {
    showModal: boolean;
    showBanner: boolean;
    preferences: CookiePreferences;
    setShowBanner: (show: boolean) => void;
    setPreferences: (p: CookiePreferences) => void;
    openPreferences: (prefs?: CookiePreferences) => void;
    closeModal: () => void;
}

const useCookieConsent = create<CookieConsentStore>((set) => ({
    showModal: false,
    showBanner: false,
    preferences: {
        essential: true,
        analytics: false
    },
    setShowBanner: (show) => set({ showBanner: show }),
    setPreferences: (preferences) => set({ preferences }),
    openPreferences: (preferences = {
        essential: true,
        analytics: false
    }) => set({ 
        showModal: true, 
        showBanner: false, 
        preferences 
    }),
    closeModal: () => set({ showModal: false }),
}));

export default useCookieConsent