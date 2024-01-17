import fonts, { LoadedFont } from './fonts';

describe('Fonts', () => {
    afterEach(() => {
        fonts._resetLoadedFonts();
    });

    it('Can load local font immediately', async () => {
        const result = await fonts.loadFont('Arial', { source: 'local(Arial)' });
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBeFalsy();
        expect((result as LoadedFont).font.status).toBe('loaded');
    });

    it('Remote font is not loaded immediately', async () => {
        const result = await fonts.loadFont('Arial', { source: "url('/path/to/font')" });
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBeFalsy();
        expect((result as LoadedFont).font.status).toBe('unloaded');
    });

    it('Can load remote font as fallback if local font is not available', async () => {
        const result = await fonts.loadFont('Remote', { source: 'local(Remote)' }, { source: "url('/path/to/font')" });
        expect(result).toBeDefined();
        expect((result as LoadedFont).source).toContain('url');
    });

    it('Cannot load multiple font faces for same family', async () => {
        const result = await fonts.loadFont('Arial', [
            { source: "url('/path/to/font1')" },
            { source: "url('/path/to/font2')" },
        ]);
        expect(Array.isArray(result)).toBeTruthy();
        expect(result).toHaveLength(2);
    });

    it('Cannot load a mix of local and remote font faces', async () => {
        const result = await fonts.loadFont('Arial', [{ source: 'local(Arial)' }, { source: "url('/path/to/font')" }]);
        expect(result).toBeUndefined();
    });
});
