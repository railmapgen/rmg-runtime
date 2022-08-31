import channel from './channel';
import { ChannelEventHandler, Events } from '../util/types';
import { RMG_RUNTIME_LANGUAGE_KEY } from '../util/constant';

const languages = ['en', 'zh-Hans', 'zh-Hant'];

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

export default { setLanguage, getLanguage, onLanguageChange };
