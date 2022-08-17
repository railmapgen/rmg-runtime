import Config from './util/config';

const startUpTime = new Date();
const config = new Config();

const rmgRuntime = {
    getAppName: () => config.component,
    getAppVersion: () => config.version,
    getInstance: () => config.instance,
    isReady: () => config.isReady,

    // benchmark
    getMsSinceStartUp: () => {
        return new Date().getTime() - startUpTime.getTime();
    },
};

export default rmgRuntime;
