import config from './service/config';
import eventLogger from './service/event-logger';
import frame from './service/frame';
import settings from './service/settings';
import benchmark from './service/benchmark';
import storage from './service/storage';

const rmgRuntime = {
    // ready
    ready: async () => {
        await Promise.all([config.waitForSettled()]);
    },

    // config
    getAppName: config.getComponent,
    getAppVersion: config.getVersion,
    getEnv: config.getEnvironment,
    getInstance: config.getInstance,

    // event
    event: eventLogger.customEvent,

    // frame
    isStandaloneWindow: frame.isStandaloneWindow,
    injectCss: frame.injectCss,
    openApp: frame.openApp,
    onAppOpen: frame.onAppOpen,
    updateUrl: frame.updateUrl,
    onUrlUpdate: frame.onUrlUpdate,

    // settings
    setLanguage: settings.setLanguage,
    getLanguage: settings.getLanguage,
    onLanguageChange: settings.onLanguageChange,

    // storage
    clearStorageForCurrentApp: storage.clearStorageForCurrentApp,

    // benchmark
    getMsSinceStartUp: benchmark.getMsSinceStartUp,
};

(window as any).rmgRuntime = rmgRuntime;
export * from './util/rmg-types';
export default rmgRuntime;
