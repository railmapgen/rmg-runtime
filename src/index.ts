import config from './service/config';
import eventLogger from './service/event-logger';
import frame from './service/frame';
import settings from './service/settings';
import benchmark from './service/benchmark';
import storage from './service/storage';
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
    injectCss: frame.injectCss,
    openApp: frame.openApp,
    onAppOpen: frame.onAppOpen,
    updateUrl: frame.updateUrl,
    onUrlUpdate: frame.onUrlUpdate,

    // settings
    setLanguage: settings.setLanguage,
    getLanguage: settings.getLanguage,
    onLanguageChange: settings.onLanguageChange,
    isAnalyticsQADone: settings.isAnalyticsQADone,
    allowAnalytics: settings.allowAnalytics,

    // storage
    clearStorageForCurrentApp: storage.clearStorageForCurrentApp,

    // benchmark
    getMsSinceStartUp: benchmark.getMsSinceStartUp,
};

init().then();
(window as any).rmgRuntime = rmgRuntime;
export * from './util/rmg-types';
export default rmgRuntime;
