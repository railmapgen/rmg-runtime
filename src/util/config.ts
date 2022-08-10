export default class Config {
    private _component: string = 'rmg-unknown';
    private _version: string = 'unknown';
    private _instance: string = 'unknown';
    private _isReady: boolean = false;

    constructor() {
        this.fetchInfoJson().then(() => (this._isReady = true));
    }

    private async fetchInfoJson() {
        const res = await fetch('./info.json');
        if (res.ok) {
            const info = await res.json();

            this._component = info.component;
            this._version = info.version;
            this._instance = info.instance;
        }
    }

    get component(): string {
        return this._component;
    }

    get version(): string {
        return this._version;
    }

    get instance(): string {
        return this._instance;
    }

    get isReady(): boolean {
        return this._isReady;
    }
}
