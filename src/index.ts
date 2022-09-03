import config from './service/config';
import frame from './service/frame';
import settings from './service/settings';

const startUpTime = new Date();

const rmgRuntime = {
    // config
    getAppName: config.getComponent,
    getAppVersion: config.getVersion,
    getEnv: config.getEnvironment,
    getInstance: config.getInstance,

    // frame
    isStandaloneWindow: frame.isStandaloneWindow,
    injectCss: frame.injectCss,
    openApp: frame.openApp,
    onAppOpen: frame.onAppOpen,

    // settings
    setLanguage: settings.setLanguage,
    getLanguage: settings.getLanguage,
    onLanguageChange: settings.onLanguageChange,

    // benchmark
    getMsSinceStartUp: () => {
        return new Date().getTime() - startUpTime.getTime();
    },
};

(window as any).rmgRuntime = rmgRuntime;
export default rmgRuntime;
