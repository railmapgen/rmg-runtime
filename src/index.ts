import config from './service/config';
import eventLogger from './service/event-logger';
import frame from './service/frame';
import channel from './service/channel';
import settings from './service/settings';
import benchmark from './service/benchmark';
import storage from './service/storage';
import * as i18n from './service/i18n';
import { waitFor } from './util/util';

let initialised = false;
const init = async () => {
    await config.loadWithTimeout();

    if (settings.isAnalyticsQADone()) {
        if (settings.isAllowAnalytics()) {
            // init GA if user previously opt-in
            console.log('[rmg-runtime] User has previously allowed GA');
            eventLogger.init();
        }
    } else {
        if (frame.isStandaloneWindow() && config.getComponent() !== 'rmg-home') {
            // init GA if QA not done but open in standalone window
            console.warn(
                '[rmg-runtime] App is opened in standalone window but analytics Q&A is not finished. GA will be init by default.'
            );
            eventLogger.init();
        }
    }

    initialised = true;
};

const ready = async () => {
    let elapsedSeconds = 0;
    while (elapsedSeconds <= 10 && !initialised) {
        await waitFor(1000);
        elapsedSeconds += 1;
    }
};

const rmgRuntime = {
    // ready
    ready,

    // config
    getAppName: config.getComponent,
    getAppVersion: config.getVersion,
    getEnv: config.getEnvironment,
    getInstance: config.getInstance,

    // event
    event: eventLogger.customEvent,

    // frame
    isStandaloneWindow: frame.isStandaloneWindow,
    injectUITools: frame.injectUITools,
    openApp: frame.openApp,
    onAppOpen: frame.onAppOpen,
    closeApp: frame.closeApp,
    onAppClose: frame.onAppClose,
    updateUrl: frame.updateUrl,
    onUrlUpdate: frame.onUrlUpdate,
    toggleNavMenu: frame.toggleNavMenu,

    // channel
    postEvent: channel.postEvent,
    onMessage: channel.onMessage,

    // settings
    setLanguage: settings.setLanguage,
    getLanguage: settings.getLanguage,
    onLanguageChange: settings.onLanguageChange,
    setColourMode: settings.setColourMode,
    getColourMode: settings.getColourMode,
    onColourModeChange: settings.onColourModeChange,
    isAnalyticsQADone: settings.isAnalyticsQADone,
    isAllowAnalytics: settings.isAllowAnalytics,
    allowAnalytics: settings.allowAnalytics,

    // storage
    getStorageForCurrentApp: storage.getStorageForCurrentApp,
    clearStorageForCurrentApp: storage.clearStorageForCurrentApp,

    // benchmark
    getMsSinceStartUp: benchmark.getMsSinceStartUp,

    // i18n
    I18nBuilder: i18n.I18nBuilder,
    getI18nInstance: i18n.getI18nInstance,
};

init().then();
(window as any).rmgRuntime = rmgRuntime;
export * from './util/rmg-types';
export default rmgRuntime;
