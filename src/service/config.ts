import { RmgRuntimeInfoConfig } from '../util/types';
import { waitFor } from '../util/util';
import { RmgEnv, RmgInstance } from '../util/rmg-types';
import { RMT_ALIAS, RMT_COMPONENT_NAME, UNKNOWN_COMPONENT } from '../util/constant';

let initialised: boolean;
let component: string;
let version: string;
let environment: RmgEnv;
let instance: RmgInstance;

const _resetConfig = () => {
    initialised = false;
    component = UNKNOWN_COMPONENT;
    version = 'unknown';
    environment = RmgEnv.PRD;
    instance = 'unknown';
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

const loadWithTimeout = async () => {
    try {
        console.log('[runtime] Loading config...');
        const result = await Promise.race([fetchInfoJson(), waitFor(10 * 1000)]);
        if (!result) {
            initialised = true;
            console.log('[runtime] Config loaded!');
        } else {
            console.error('[runtime] Failed to load config.', result);
        }
    } catch (e) {
        console.error('[runtime] Failed to load config.', e);
    }
};

const isInitialised = (): boolean => {
    return initialised;
};

const getComponent = (): string => {
    return isRMT() ? RMT_ALIAS : component;
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

const isRMT = (): boolean => {
    return component === RMT_COMPONENT_NAME;
};

_resetConfig();

export default {
    loadWithTimeout,
    isInitialised,
    getComponent,
    getVersion,
    getEnvironment,
    getInstance,
    isRMT,
    _resetConfig,
};
