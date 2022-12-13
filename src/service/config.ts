import { RmgRuntimeInfoConfig } from '../util/types';
import { waitFor } from '../util/util';
import { RmgEnv, RmgInstance } from '../util/rmg-types';

let initialised: boolean;
let component: string;
let version: string;
let environment: RmgEnv;
let instance: RmgInstance;

const _resetConfig = () => {
    initialised = false;
    component = 'rmg-unknown';
    version = 'unknown';
    environment = RmgEnv.PRD;
    instance = RmgInstance.UNKNOWN;
};

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
    } else {
        throw new Error(`Failed to fetch config from ${url}`);
    }
};

const waitForSettled = async () => {
    try {
        console.log('[rmg-runtime] Loading config...');
        const result = await Promise.race([fetchInfoJson(), waitFor(10 * 1000)]);
        if (!result) {
            initialised = true;
            console.log('[rmg-runtime] Config loaded!');
        } else {
            console.error('[rmg-runtime] Failed to load config.', result);
        }
    } catch (e) {
        console.error('[rmg-runtime] Failed to load config.', e);
    }
};

const isInitialised = (): boolean => {
    return initialised;
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

_resetConfig();

export default {
    waitForSettled,
    isInitialised,
    getComponent,
    getVersion,
    getEnvironment,
    getInstance,
    _resetConfig,
};
