import Config from './service/config';
import frame from './service/frame';
import settings from './service/settings';

const startUpTime = new Date();
const config = new Config();

const rmgRuntime = {
    // config
    getAppName: config.getComponent.bind(config),
    getAppVersion: config.getVersion.bind(config),
    getEnv: config.getEnvironment.bind(config),
    getInstance: config.getInstance.bind(config),

    // frame
    isStandaloneWindow: frame.isStandaloneWindow,
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
