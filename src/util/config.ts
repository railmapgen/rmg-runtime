import { RmgEnv, RmgRuntimeInfoConfig, RmgRuntimeInstance } from './types';

export default class Config {
    private _component = 'rmg-unknown';
    private _version = 'unknown';
    private _environment = RmgEnv.PRD;
    private _instance = RmgRuntimeInstance.UNKNOWN;
    private _isReady = false;

    constructor() {
        this.fetchInfoJson().then(() => (this._isReady = true));
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

    get component(): string {
        return this._component;
    }

    get version(): string {
        return this._version;
    }

    get environment(): RmgEnv {
        return this._environment;
    }

    get instance(): string {
        return this._instance;
    }

    get isReady(): boolean {
        return this._isReady;
    }
}
