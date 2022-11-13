import channel from './channel';
import { ChannelEventHandler, Events } from '../util/types';

const isStandaloneWindow = () => {
    return !window.frameElement;
};

const injectCss = () => {
    if (!isStandaloneWindow()) {
        const style = document.createElement('style');
        style.textContent = `.rmg-window__header{display: none !important;}`;
        document.head.append(style);
    }
};

const openApp = (appId: string) => {
    channel.postEvent(Events.OPEN_APP, appId);
};

const updateUrl = (url: string) => {
    channel.postEvent(Events.UPDATE_URL, url);
};

const onAppOpen = (callback: ChannelEventHandler) => {
    channel.onMessage(Events.OPEN_APP, callback);
};

const onUrlUpdate = (callback: ChannelEventHandler) => {
    channel.onMessage(Events.UPDATE_URL, callback);
};

export default {
    isStandaloneWindow,
    injectCss,
    openApp,
    onAppOpen,
    updateUrl,
    onUrlUpdate,
};
