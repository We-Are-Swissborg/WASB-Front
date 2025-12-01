export type CookiePreferences = {
    essential: boolean;
    analytics: boolean;
}

export type ConsentData = {
    consented: boolean;
    preferences: CookiePreferences;
    timestamp: string;
}

// Declare gtag function for TypeScript
declare global {
    interface Window {
        gtag?: (
            command: 'consent' | 'config' | 'event' | 'js' | 'set',
            targetId: string | Date,
            config?: {
                analytics_storage?: 'granted' | 'denied';
                ad_storage?: 'granted' | 'denied';
                wait_for_update?: number;
                [key: string]: any;
            }
        ) => void;
        dataLayer?: any[];
    }
}