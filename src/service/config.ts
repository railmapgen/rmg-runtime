import { RmgRuntimeInfoConfig } from '../util/types';
import { waitFor } from '../util/util';
import { RmgEnv, RmgInstance } from '../util/rmg-types';

let component = 'rmg-unknown';
let version = 'unknown';
let environment = RmgEnv.PRD;
let instance = RmgInstance.UNKNOWN;
let isSettled = false;

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
    const MAX_ATTEMPTS = 20;
    let attempt = 0;

    while (attempt++ < MAX_ATTEMPTS) {
        if (isSettled) {
            return;
        } else {
            console.log(`[rmg-runtime] Config is not ready yet. Attempt: ${attempt}/${MAX_ATTEMPTS}`);
            await waitFor(500);
        }
    }

    isSettled = true; // mark as true
    console.error('[rmg-runtime] Failed to load config after 10 seconds');
    return;
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

fetchInfoJson().finally(() => {
    isSettled = true;
});

export default {
    waitForSettled,
    getComponent,
    getVersion,
    getEnvironment,
    getInstance,
};
