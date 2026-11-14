import { afterEach, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import 'global-jsdom/register';
import fonts, { _resetGetAllFonts, _resetLoadedFonts } from './fonts.ts';
import { RMG_RUNTIME_CHANNEL_NAME } from './channel.ts';
import { MockFontFace } from '../setupTests.ts';

globalThis.FontFace = MockFontFace as unknown as typeof FontFace;
if (!document.fonts) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.fonts = {
        add: () => {},
        delete: () => {},
    };
}

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
        testChannel.close();
        testChannelReceives = [];
    });

    it('Can load font list if config is not specified', async t => {
        const mockFetch = t.mock.method(global, 'fetch', async () => ({
            json: async () => ({ Arial: { configs: [{ source: 'local(Arial)' }] } }),
        }));
        const result = await fonts.loadFont('Arial');

        assert.equal(mockFetch.mock.callCount(), 1);
        assert.equal(result?.configs.length, 1);
    });

    it('Can throw error if requested font is not found in config', async t => {
        t.mock.method(global, 'fetch', async () => ({
            json: async () => ({}),
        }));
        await assert.rejects(fonts.loadFont('Arial'));
    });

    it('Can load local font immediately', async () => {
        const result = await fonts.loadFont('Arial', {
            configs: [{ source: 'local(Arial)' }],
        });
        assert.equal(result?.configs.length, 1);
        assert.equal(result?.configs[0].font.status, 'loaded');
    });

    it('Remote font is not loaded immediately', async () => {
        const result = await fonts.loadFont('Arial', {
            configs: [{ source: "url('/path/to/font')" }],
        });
        assert.equal(result?.configs.length, 1);
        assert.equal(result?.configs[0].font.status, 'unloaded');
    });

    it('Can load remote font as fallback if local font is not available', async () => {
        const result = await fonts.loadFont('Remote', {
            configs: [{ source: 'local(Remote)' }, { source: "url('/path/to/font')" }],
        });
        assert.equal(result?.configs.length, 1);
        assert.ok(result?.configs[0].source.includes('url'));
    });

    it('Cannot load multiple font faces for same family', async () => {
        const result = await fonts.loadFont('Arial', {
            configs: [[{ source: "url('/path/to/font1')" }, { source: "url('/path/to/font2')" }]],
        });
        assert.equal(result?.configs.length, 2);
    });

    it('Cannot load a mix of local and remote font faces', async () => {
        const result = await fonts.loadFont('Arial', {
            configs: [[{ source: 'local(Arial)' }, { source: "url('/path/to/font')" }]],
        });
        assert.equal(result?.configs, undefined);
    });

    it('Can get CSS stylesheet for loaded fonts', async t => {
        t.mock.method(global, 'fetch', async () => ({
            blob: async () => new window.Blob(['MOCKED'], { type: 'font/woff2' }),
        }));
        const result = await fonts.loadFont('GenYoMin', {
            configs: [
                [
                    {
                        source: "url('/path/to/font1')",
                        descriptors: {
                            unicodeRange: 'U+4E00-4FFF',
                            weight: '400 700',
                            style: 'normal',
                            display: 'swap',
                            featureSettings: '"kern" 1',
                            variationSettings: '"wght" 600',
                            ascentOverride: '90%',
                        },
                    },
                    { source: "url('/path/to/font2')", descriptors: { unicodeRange: 'U+5000-57FF' } },
                ],
            ],
        });

        // wait for fonts loaded
        await result?.configs[0].font.load();

        const css = await fonts.getFontCSS('GenYoMin');
        assert.equal(
            css,
            `@font-face {
    font-family: 'GenYoMin';
    src: url('data:font/woff2;base64,TU9DS0VE');
    unicode-range: U+4E00-4FFF;
font-weight: 400 700;
font-style: normal;
font-display: swap;
font-feature-settings: "kern" 1;
font-variation-settings: "wght" 600;
ascent-override: 90%;
}`
        );
    });

    it('Retries only failed subsets on demand and preserves the original loaded notification', async t => {
        const definition = {
            displayName: 'Subsets',
            url: 'https://example.com/fonts',
            configs: [
                ['latin', 'greek', 'han', 'kana'].map(source => ({ source: `url('/${source}.woff2')` })),
                { source: 'local(Fallback)' },
            ],
        };
        const result = await fonts.loadFont('Subsets', definition);
        assert.ok(result);
        const original = result.configs.map(config => config.font);
        await original[0].load();
        await t.waitFor(() => assert.equal(testChannelReceives.length, 1));
        testChannelReceives = [];
        (original[3] as unknown as MockFontFace).status = 'loading';
        const add = t.mock.method(document.fonts, 'add');
        const remove = t.mock.method(document.fonts, 'delete');
        const load = t.mock.method(MockFontFace.prototype, 'load');

        for (let attempt = 1; attempt <= 2; attempt++) {
            const failed = result.configs[1].font as unknown as MockFontFace;
            failed.status = 'error';
            failed.loadingRejecter!('NetworkError');
            assert.strictEqual(await fonts.loadFont('Subsets'), result);
            assert.notStrictEqual(result.configs[1].font, failed);
            assert.equal(result.configs[1].font.status, 'unloaded');
            assert.equal(load.mock.callCount(), 0);
            assert.equal(add.mock.callCount(), attempt);
            assert.equal(remove.mock.callCount(), attempt);
            assert.strictEqual(remove.mock.calls[attempt - 1].arguments[0], failed);
            await fonts.loadFont('Subsets');
            assert.equal(add.mock.callCount(), attempt);
        }
        for (const index of [0, 2, 3]) assert.strictEqual(result.configs[index].font, original[index]);
        assert.equal(result.displayName, definition.displayName);
        assert.equal(result.url, definition.url);
        await result.configs[1].font.load();
        await t.waitFor(() => assert.equal(testChannelReceives.length, 1));
        assert.partialDeepStrictEqual(testChannelReceives[0], {
            event: 'LOAD_REMOTE_FONT',
            data: { family: 'Subsets', definition },
        });
    });

    it('Can broadcast remote font loaded event', async t => {
        const arial = await fonts.loadFont('Arial', { configs: [{ source: 'local(Arial)' }] });
        await Promise.all(arial?.configs.map(config => config.font.load()) ?? []);
        const genyomin = await fonts.loadFont('GenYoMin', { configs: [{ source: "url('/path/to/font')" }] });
        await Promise.all(genyomin?.configs.map(config => config.font.load()) ?? []);

        await t.waitFor(() => assert.equal(testChannelReceives.length, 1));
        assert.partialDeepStrictEqual(testChannelReceives[0], {
            event: 'LOAD_REMOTE_FONT',
            data: { family: 'GenYoMin' },
        });
    });
});
