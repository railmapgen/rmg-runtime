import channel from './channel';
import { ChannelEventHandler } from '../util/types';

const isStandaloneWindow = () => {
    return !window.frameElement;
};

const isRMTMenuShown = () => {
    return !!window.frameElement?.closest('.show-menu');
};

const injectUITools = () => {
    // add transition style
    const style = document.createElement('style');
    style.textContent = `.rmg-window__header{transition: 0.3s ease-in-out;}`;
    document.head.appendChild(style);

    // define indent style
    const indentHeader = document.createElement('style');
    indentHeader.textContent = `.rmg-window__header{margin-left: 40px;}`;

    // first render
    if (!isRMTMenuShown()) {
        document.head.appendChild(indentHeader);
    }

    // event listener
    channel.onMessage('TOGGLE_NAV_MENU', isOpen => {
        if (isOpen) {
            try {
                document.head.removeChild(indentHeader);
            } catch (e) {
                console.warn('[rmg-runtime] Unable to remove indent style from RmgWindowHeader', e);
            }
        } else {
            document.head.appendChild(indentHeader);
        }
    });
};

const openApp = (appId: string) => {
    channel.postEvent('OPEN_APP', appId);
};

const updateUrl = (url: string) => {
    channel.postEvent('UPDATE_URL', url);
};

const onAppOpen = (callback: ChannelEventHandler) => {
    channel.onMessage('OPEN_APP', callback);
};

const onUrlUpdate = (callback: ChannelEventHandler) => {
    channel.onMessage('UPDATE_URL', callback);
};

const toggleNavMenu = (isOpen: boolean) => {
    channel.postEvent('TOGGLE_NAV_MENU', isOpen, true);
};

export default {
    isStandaloneWindow,
    injectUITools,
    openApp,
    onAppOpen,
    updateUrl,
    onUrlUpdate,
    toggleNavMenu,
};
