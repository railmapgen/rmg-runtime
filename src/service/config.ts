import { RmgEnv, RmgRuntimeInfoConfig, RmgRuntimeInstance } from '../util/types';
import { waitFor } from '../util/util';

let component = 'rmg-unknown';
let version = 'unknown';
let environment = RmgEnv.PRD;
let instance = RmgRuntimeInstance.UNKNOWN;
let isSettled = false;

const fetchInfoJson = async () => {
    const basePath = window.location.pathname.split('/')[1];
    const res = await fetch(`/${basePath}/info.json`);
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

const getComponent = async (): Promise<string> => {
    await waitForSettled();
    return component;
};

const getVersion = async (): Promise<string> => {
    await waitForSettled();
    return version;
};

const getEnvironment = async (): Promise<RmgEnv> => {
    await waitForSettled();
    return environment;
};

const getInstance = async (): Promise<RmgRuntimeInstance> => {
    await waitForSettled();
    return instance;
};

fetchInfoJson().finally(() => {
    isSettled = true;
});

export default {
    getComponent,
    getVersion,
    getEnvironment,
    getInstance,
};
