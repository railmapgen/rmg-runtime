import channel from './channel';
import { ChannelEventHandler } from '../util/types';
import {
    RMG_RUNTIME_ALLOW_ANALYTICS_KEY,
    RMG_RUNTIME_COLOUR_MODE_KEY,
    RMG_RUNTIME_LANGUAGE_KEY,
} from '../util/constant';
import eventLogger from './event-logger';

const SET_LANGUAGE = 'SET_LANGUAGE';
const SET_COLOUR_MODE = 'SET_COLOUR_MODE';

const setLanguage = (value: string) => {
    channel.postEvent(SET_LANGUAGE, value);
    window.localStorage.setItem(RMG_RUNTIME_LANGUAGE_KEY, value);
};

const getLanguage = () => {
    return window.localStorage.getItem(RMG_RUNTIME_LANGUAGE_KEY) || 'en';
};

const onLanguageChange = (callback: ChannelEventHandler<string>) => {
    channel.onMessage(SET_LANGUAGE, callback);
};

const colourModes = ['light', 'dark', 'system'] as const;
type ColourMode = (typeof colourModes)[number];

const setColourMode = (value: ColourMode) => {
    if (colourModes.includes(value)) {
        channel.postEvent(SET_COLOUR_MODE, value);
        window.localStorage.setItem(RMG_RUNTIME_COLOUR_MODE_KEY, value);
    }
};

const isColourMode = (value: string | null): value is ColourMode => {
    return Boolean(value && (colourModes as readonly string[]).includes(value));
};

const getColourMode = (): ColourMode => {
    const colourModeFromStorage = window.localStorage.getItem(RMG_RUNTIME_COLOUR_MODE_KEY);
    return isColourMode(colourModeFromStorage) ? colourModeFromStorage : 'system';
};

const onColourModeChange = (callback: ChannelEventHandler<ColourMode>) => {
    channel.onMessage(SET_COLOUR_MODE, callback);
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
