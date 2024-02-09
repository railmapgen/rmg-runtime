import fonts, { _resetLoadedFonts, _resetGetAllFonts } from './fonts';

const originalFetch = global.fetch;

describe('Fonts', () => {
    afterEach(() => {
        _resetLoadedFonts();
        _resetGetAllFonts();
        global.fetch = originalFetch;
    });

    it('Can load font list if config is not specified', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve({ Arial: { configs: [{ source: 'local(Arial)' }] } }),
        });
        const result = await fonts.loadFont('Arial');

        expect(fetch).toBeCalledTimes(1);
        expect(result?.configs).toHaveLength(1);
    });

    it('Can throw error if requested font is not found in config', () => {
        global.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve({}),
        });
        expect(async () => await fonts.loadFont('Arial')).rejects.toThrow();
    });

    it('Can load local font immediately', async () => {
        const result = await fonts.loadFont('Arial', {
            configs: [{ source: 'local(Arial)' }],
        });
        expect(result?.configs).toHaveLength(1);
        expect(result?.configs[0].font.status).toBe('loaded');
    });

    it('Remote font is not loaded immediately', async () => {
        const result = await fonts.loadFont('Arial', {
            configs: [{ source: "url('/path/to/font')" }],
        });
        expect(result?.configs).toHaveLength(1);
        expect(result?.configs[0].font.status).toBe('unloaded');
    });

    it('Can load remote font as fallback if local font is not available', async () => {
        const result = await fonts.loadFont('Remote', {
            configs: [{ source: 'local(Remote)' }, { source: "url('/path/to/font')" }],
        });
        expect(result?.configs).toHaveLength(1);
        expect(result?.configs[0].source).toContain('url');
    });

    it('Cannot load multiple font faces for same family', async () => {
        const result = await fonts.loadFont('Arial', {
            configs: [[{ source: "url('/path/to/font1')" }, { source: "url('/path/to/font2')" }]],
        });
        expect(result?.configs).toHaveLength(2);
    });

    it('Cannot load a mix of local and remote font faces', async () => {
        const result = await fonts.loadFont('Arial', {
            configs: [[{ source: 'local(Arial)' }, { source: "url('/path/to/font')" }]],
        });
        expect(result?.configs).toBeUndefined();
    });

    it('Can get CSS stylesheet for loaded fonts', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            blob: () => Promise.resolve(new Blob(['MOCKED'], { type: 'font/woff2' })),
        });
        const result = await fonts.loadFont('GenYoMin', {
            configs: [
                [
                    { source: "url('/path/to/font1')", descriptors: { unicodeRange: 'U+4E00-4FFF' } },
                    { source: "url('/path/to/font2')", descriptors: { unicodeRange: 'U+5000-57FF' } },
                ],
            ],
        });

        // wait for fonts loaded
        await result?.configs[0].font.load();

        const css = await fonts.getFontCSS('GenYoMin');
        expect(css).toBe(`@font-face {
    font-family: 'GenYoMin';
    src: url('data:font/woff2;base64,TU9DS0VE');
    unicodeRange: U+4E00-4FFF;
}`);
    });
});
