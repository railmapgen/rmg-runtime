global.fetch = vi.fn().mockImplementation(() => {
    return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
    }) as any;
});

class MockFontFace {
    family: string;
    status = 'unloaded';

    constructor(family: string) {
        this.family = family;
    }

    load() {
        return new Promise<void>((resolve, reject) => {
            this.status = 'loading';

            if (this.family === 'Remote') {
                this.status = 'error';
                reject('NetworkError');
            } else {
                setTimeout(() => {
                    this.status = 'loaded';
                    resolve();
                }, 100);
            }
        });
    }
}

vi.stubGlobal('FontFace', MockFontFace);

Object.defineProperty(document, 'fonts', { value: new Set() });
