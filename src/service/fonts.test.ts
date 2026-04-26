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
                    { source: "url('/path/to/font1')", descriptors: { unicodeRange: 'U+4E00-4FFF' } },
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
    unicodeRange: U+4E00-4FFF;
}`
        );
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
