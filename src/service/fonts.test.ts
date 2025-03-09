import fonts, { _resetLoadedFonts, _resetGetAllFonts } from './fonts';
import { RMG_RUNTIME_CHANNEL_NAME } from './channel';
import { waitFor } from '@testing-library/dom';

const originalFetch = global.fetch;

describe('Fonts', () => {
    let testChannel: BroadcastChannel;
    let testChannelReceives: unknown[] = [];

    beforeEach(() => {
        testChannel = new BroadcastChannel(RMG_RUNTIME_CHANNEL_NAME);
        testChannel.onmessage = ev => testChannelReceives.push(ev.data);
    });

    afterEach(() => {
        _resetLoadedFonts();
        _resetGetAllFonts();
        global.fetch = originalFetch;
        testChannel.close();
        testChannelReceives = [];
    });

    it('Can load font list if config is not specified', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve({ Arial: { configs: [{ source: 'local(Arial)' }] } }),
        });
        const result = await fonts.loadFont('Arial');

        expect(fetch).toBeCalledTimes(1);
        expect(result?.configs).toHaveLength(1);
    });

    it('Can throw error if requested font is not found in config', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve({}),
        });
        await expect(async () => await fonts.loadFont('Arial')).rejects.toThrow();
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

    it('Can broadcast remote font loaded event', async () => {
        const arial = await fonts.loadFont('Arial', { configs: [{ source: 'local(Arial)' }] });
        await Promise.all(arial?.configs.map(config => config.font.load()) ?? []);
        const genyomin = await fonts.loadFont('GenYoMin', { configs: [{ source: "url('/path/to/font')" }] });
        await Promise.all(genyomin?.configs.map(config => config.font.load()) ?? []);

        await waitFor(() => expect(testChannelReceives).toHaveLength(1));
        expect(testChannelReceives[0]).toEqual({
            event: 'LOAD_REMOTE_FONT',
            data: expect.objectContaining({ family: 'GenYoMin' }),
        });
    });
});
