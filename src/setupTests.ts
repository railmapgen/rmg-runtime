global.fetch = vi.fn().mockImplementation(() => {
    return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
    });
});

class MockFontFace {
    family: string;

    loadingResolver?: (value: MockFontFace) => void = undefined;
    loadingRejecter?: (reason?: string) => void = undefined;
    loadingPromise: Promise<MockFontFace>;

    status = 'unloaded';

    constructor(family: string) {
        this.family = family;
        this.loadingPromise = new Promise<MockFontFace>((resolve, reject) => {
            this.loadingResolver = resolve;
            this.loadingRejecter = reject;
        });
    }

    load() {
        if (this.status !== 'unloaded') {
            return this.loadingPromise;
        }

        this.status = 'loading';

        if (this.family === 'Remote') {
            this.status = 'error';
            this.loadingRejecter!('NetworkError');
        } else {
            setTimeout(() => {
                this.status = 'loaded';
                this.loadingResolver!(this);
            }, 100);
        }
        return this.loadingPromise;
    }

    get loaded() {
        return this.loadingPromise;
    }
}

vi.stubGlobal('FontFace', MockFontFace);

Object.defineProperty(document, 'fonts', { value: new Set() });
