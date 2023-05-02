import channel from './channel';
import { ChannelEventHandler } from '../util/types';
import {
    RMG_RUNTIME_ALLOW_ANALYTICS_KEY,
    RMG_RUNTIME_COLOUR_MODE_KEY,
    RMG_RUNTIME_LANGUAGE_KEY,
} from '../util/constant';
import eventLogger from './event-logger';

const languages = ['en', 'zh-Hans', 'zh-Hant', 'ko'] as const;
type SupportedLanguage = (typeof languages)[number];

const setLanguage = (value: SupportedLanguage) => {
    if (languages.includes(value)) {
        channel.postEvent('SET_LANGUAGE', value);
        window.localStorage.setItem(RMG_RUNTIME_LANGUAGE_KEY, value);
    }
};

const getLanguage = (): SupportedLanguage => {
    const languageFromStorage: any = window.localStorage.getItem(RMG_RUNTIME_LANGUAGE_KEY);
    return languageFromStorage && languages.includes(languageFromStorage) ? languageFromStorage : 'en';
};

const onLanguageChange = (callback: ChannelEventHandler<SupportedLanguage>) => {
    channel.onMessage('SET_LANGUAGE', callback);
};

const colourModes = ['light', 'dark', 'system'] as const;
type ColourMode = (typeof colourModes)[number];

const setColourMode = (value: ColourMode) => {
    if (colourModes.includes(value)) {
        channel.postEvent('SET_COLOUR_MODE', value, true);
        window.localStorage.setItem(RMG_RUNTIME_COLOUR_MODE_KEY, value);
    }
};

const getColourMode = (): (typeof colourModes)[number] => {
    const colourModeFromStorage = window.localStorage.getItem(RMG_RUNTIME_COLOUR_MODE_KEY) as any;
    return colourModeFromStorage && colourModes.includes(colourModeFromStorage) ? colourModeFromStorage : 'system';
};

const onColourModeChange = (callback: ChannelEventHandler<ColourMode>) => {
    channel.onMessage('SET_COLOUR_MODE', callback);
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

export default {
    setLanguage,
    getLanguage,
    onLanguageChange,
    setColourMode,
    getColourMode,
    onColourModeChange,
    isAnalyticsQADone,
    isAllowAnalytics,
    allowAnalytics,
};
