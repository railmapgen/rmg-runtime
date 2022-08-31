import channel from './channel';
import { ChannelEventHandler, Events } from '../util/types';

const isStandaloneWindow = () => {
    return !window.frameElement;
};

const openApp = (appId: string) => {
    channel.postEvent(Events.OPEN_APP, appId);
};

const onAppOpen = (callback: ChannelEventHandler) => {
    channel.onMessage(Events.OPEN_APP, callback);
};

export default {
    isStandaloneWindow,
    openApp,
    onAppOpen,
};
