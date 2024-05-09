import channel from './channel';
import { ChannelEventHandler } from '../util/types';

const TOGGLE_NAV_MENU = 'TOGGLE_NAV_MENU';
const OPEN_APP = 'OPEN_APP';
const CLOSE_APP = 'CLOSE_APP';
const UPDATE_APP_METADATA = 'UPDATE_APP_METADATA';
const UPDATE_URL = 'UPDATE_URL';

const isStandaloneWindow = () => {
    return !window.frameElement;
};

const isRMTMenuShown = () => {
    return !!window.frameElement?.closest('.show-menu');
};

const injectUITools = () => {
    // add frame style
    if (!isStandaloneWindow()) {
        const frameStyle = document.createElement('style');
        frameStyle.textContent = 'body{padding: 0;}';
        document.head.appendChild(frameStyle);
    }

    // define indent style
    const indentHeader = document.createElement('style');
    indentHeader.textContent = '.rmg-window__header:not(.rmg-window__app-clip-header){margin-left: 40px;}';

    // first render
    if (!isStandaloneWindow() && !isRMTMenuShown()) {
        document.head.appendChild(indentHeader);
    }

    // event listener
    if (!isStandaloneWindow()) {
        channel.onMessage(TOGGLE_NAV_MENU, (isOpen: boolean) => {
            if (isOpen) {
                try {
                    document.head.removeChild(indentHeader);
                } catch (e) {
                    console.warn('[runtime] Unable to remove indent style from RmgWindowHeader', e);
                }
            } else {
                document.head.appendChild(indentHeader);
            }
        });
    }
};

type OpenAppPayload = {
    appId: string;
    search?: string;
    hash?: string;
};
const openApp = (payload: OpenAppPayload) => {
    channel.postEvent(OPEN_APP, payload);
};

const closeApp = (appId: string) => {
    channel.postEvent(CLOSE_APP, appId);
};

type UpdateAppMetadataPayload = {
    title?: string;
    search?: string;
    hash?: string;
};

const updateAppMetadata = (payload: UpdateAppMetadataPayload) => {
    channel.postEvent(UPDATE_APP_METADATA, payload);
};

const updateUrl = (url: string) => {
    channel.postEvent(UPDATE_URL, url);
};

const onAppOpen = (callback: ChannelEventHandler<OpenAppPayload>) => {
    channel.onMessage(OPEN_APP, callback);
};

const onAppClose = (callback: ChannelEventHandler<string>) => {
    channel.onMessage(CLOSE_APP, callback);
};

const onAppMetadataUpdate = (callback: ChannelEventHandler<UpdateAppMetadataPayload>) => {
    channel.onMessage(UPDATE_APP_METADATA, callback);
};

const onUrlUpdate = (callback: ChannelEventHandler<string>) => {
    channel.onMessage(UPDATE_URL, callback);
};

const toggleNavMenu = (isOpen: boolean) => {
    channel.postEvent(TOGGLE_NAV_MENU, isOpen, true);
};

export default {
    isStandaloneWindow,
    injectUITools,
    openApp,
    onAppOpen,
    closeApp,
    onAppClose,
    updateAppMetadata,
    onAppMetadataUpdate,
    updateUrl,
    onUrlUpdate,
    toggleNavMenu,
};
