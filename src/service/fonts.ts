const loadedFonts: Record<string, string> = {};

const getLoadedFonts = () => loadedFonts;

const loadFont = async (family: string, source: string, descriptors?: FontFaceDescriptors): Promise<boolean> => {
    if (family in loadedFonts) {
        // TODO: consider different weight of the same font?
        return true;
    }

    const font = new FontFace(family, source, descriptors);
    try {
        await font.load();
        document.fonts.add(font);
        loadedFonts[family] = source;
        return true;
    } catch (e) {
        console.warn(`[rmg-runtime] Failed to load font ${family} with source ${source}`, e);
        return false;
    }
};

const loadFontWithFallbacks = async (
    family: string,
    sources: string[],
    descriptors?: FontFaceDescriptors
): Promise<string> => {
    for (const source of sources) {
        const result = await loadFont(family, source, descriptors);
        if (result) break;
    }
    return loadedFonts[family];
};

export default {
    getLoadedFonts,
    loadFont,
    loadFontWithFallbacks,
};
