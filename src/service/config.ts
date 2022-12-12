import { RmgRuntimeInfoConfig } from '../util/types';
import { waitFor } from '../util/util';
import { RmgEnv, RmgInstance } from '../util/rmg-types';

let component = 'rmg-unknown';
let version = 'unknown';
let environment = RmgEnv.PRD;
let instance = RmgInstance.UNKNOWN;

const fetchInfoJson = async () => {
    const basePath = window.location.pathname.split('/')[1];
    const url = basePath ? `/${basePath}/info.json` : '/info.json';
    const res = await fetch(url);
    if (res.ok) {
        const info = (await res.json()) as RmgRuntimeInfoConfig;

        component = info.component;
        version = info.version;
        environment = info.environment;
        instance = info.instance;
    }
};

const waitForSettled = async () => {
    try {
        console.log('[rmg-runtime] Loading config...');
        await Promise.race([fetchInfoJson(), waitFor(10 * 1000)]);
        console.log('[rmg-runtime] Config loaded!');
    } catch (e) {
        console.error('[rmg-runtime] Failed to load config');
    }
};

const getComponent = (): string => {
    return component;
};

const getVersion = (): string => {
    return version;
};

const getEnvironment = (): RmgEnv => {
    return environment;
};

const getInstance = (): RmgInstance => {
    return instance;
};

export default {
    waitForSettled,
    getComponent,
    getVersion,
    getEnvironment,
    getInstance,
};
