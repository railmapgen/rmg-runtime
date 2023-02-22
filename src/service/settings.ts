import channel from './channel';
import { ChannelEventHandler, Events } from '../util/types';
import { RMG_RUNTIME_ALLOW_ANALYTICS_KEY, RMG_RUNTIME_LANGUAGE_KEY } from '../util/constant';
import eventLogger from './event-logger';

const languages = ['en', 'zh-Hans', 'zh-Hant', 'ko'];

const setLanguage = (value: string) => {
    if (languages.includes(value)) {
        channel.postEvent(Events.SET_LANGUAGE, value);
        window.localStorage.setItem(RMG_RUNTIME_LANGUAGE_KEY, value);
    }
};

const getLanguage = () => {
    const languageFromStorage = window.localStorage.getItem(RMG_RUNTIME_LANGUAGE_KEY);
    return languageFromStorage && languages.includes(languageFromStorage) ? languageFromStorage : 'en';
};

const onLanguageChange = (callback: ChannelEventHandler) => {
    channel.onMessage(Events.SET_LANGUAGE, callback);
};

const isAnalyticsQADone = (): boolean => {
    return window.localStorage.getItem(RMG_RUNTIME_ALLOW_ANALYTICS_KEY) !== null;
};

const isAllowAnalytics = (): boolean => {
    // requires explicit allow
    const isAllowAnalyticsFromStorage = window.localStorage.getItem(RMG_RUNTIME_ALLOW_ANALYTICS_KEY);
    return isAllowAnalyticsFromStorage === 'true';
};

export interface AllowAnalyticsResponse {
    refreshRequired: boolean;
}

const allowAnalytics = (flag: boolean): AllowAnalyticsResponse => {
    const isPrevAllowed = isAllowAnalytics();

    if (flag) {
        if (isPrevAllowed) {
            // do nothing
        } else {
            window.localStorage.setItem(RMG_RUNTIME_ALLOW_ANALYTICS_KEY, flag.toString());
            eventLogger.init();
        }
        return { refreshRequired: false };
    } else {
        if (isPrevAllowed) {
            // refresh required to opt-out GA
            window.localStorage.setItem(RMG_RUNTIME_ALLOW_ANALYTICS_KEY, flag.toString());
            return { refreshRequired: true };
        } else {
            // do nothing
            return { refreshRequired: false };
        }
    }
};

export default { setLanguage, getLanguage, onLanguageChange, isAnalyticsQADone, isAllowAnalytics, allowAnalytics };
