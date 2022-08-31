import Config from './service/config';
import frame from './service/frame';

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

    // benchmark
    getMsSinceStartUp: () => {
        return new Date().getTime() - startUpTime.getTime();
    },
};

export default rmgRuntime;
