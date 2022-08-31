import { RmgEnv, RmgRuntimeInfoConfig, RmgRuntimeInstance } from '../util/types';
import { waitFor } from '../util/util';

export default class Config {
    private _component = 'rmg-unknown';
    private _version = 'unknown';
    private _environment = RmgEnv.PRD;
    private _instance = RmgRuntimeInstance.UNKNOWN;

    private _isSettled = false;

    constructor() {
        this.fetchInfoJson().finally(() => {
            this._isSettled = true;
        });
    }

    private async fetchInfoJson() {
        const basePath = window.location.pathname.split('/')[1];
        const res = await fetch(`/${basePath}/info.json`);
        if (res.ok) {
            const info = (await res.json()) as RmgRuntimeInfoConfig;

            this._component = info.component;
            this._version = info.version;
            this._environment = info.environment;
            this._instance = info.instance;
        }
    }

    private async isSettled() {
        const MAX_ATTEMPTS = 20;
        let attempt = 0;

        while (attempt++ < MAX_ATTEMPTS) {
            if (this._isSettled) {
                return;
            } else {
                console.log(`[rmg-runtime] Config is not ready yet. Attempt: ${attempt}/${MAX_ATTEMPTS}`);
                await waitFor(500);
            }
        }

        this._isSettled = true; // mark as true
        console.error('[rmg-runtime] Failed to load config after 10 seconds');
        return;
    }

    async getComponent(): Promise<string> {
        await this.isSettled();
        return this._component;
    }

    async getVersion(): Promise<string> {
        await this.isSettled();
        return this._version;
    }

    async getEnvironment(): Promise<RmgEnv> {
        await this.isSettled();
        return this._environment;
    }

    async getInstance(): Promise<RmgRuntimeInstance> {
        await this.isSettled();
        return this._instance;
    }
}
