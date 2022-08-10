import Config from './util/config';

const config = new Config();

const rmgRuntime = {
    getAppName: () => config.component,
    getAppVersion: () => config.version,
    getInstance: () => config.instance,
    isReady: () => config.isReady,
};

export default rmgRuntime;
