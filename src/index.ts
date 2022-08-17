import Config from './util/config';

const startUpTime = new Date();
const config = new Config();

const rmgRuntime = {
    getAppName: config.getComponent.bind(config),
    getAppVersion: config.getVersion.bind(config),
    getEnv: config.getEnvironment.bind(config),
    getInstance: config.getInstance.bind(config),

    // benchmark
    getMsSinceStartUp: () => {
        return new Date().getTime() - startUpTime.getTime();
    },
};

export default rmgRuntime;
