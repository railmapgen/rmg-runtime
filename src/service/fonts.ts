type FontFaceConfig = {
    source: string;
    descriptors?: FontFaceDescriptors;
};

export type LoadedFont = FontFaceConfig & {
    font: FontFace;
};

let loadedFonts: Record<string, LoadedFont | LoadedFont[]> = {};
const getLoadedFonts = () => loadedFonts;
const _resetLoadedFonts = () => (loadedFonts = {});

const isLocalFont = (config: FontFaceConfig) => config.source.startsWith('local');

const loadSingleFontFace = async (family: string, config: FontFaceConfig): Promise<boolean> => {
    try {
        const font = new FontFace(family, config.source, config.descriptors);
        if (isLocalFont(config)) {
            await font.load();
        }
        document.fonts.add(font);
        loadedFonts[family] = { ...config, font };
        return true;
    } catch (e) {
        console.warn(`[rmg-runtime] Failed to load font ${family} with source ${config.source}`, e);
        return false;
    }
};

const loadMultipleFontFaces = async (family: string, configs: FontFaceConfig[]): Promise<boolean> => {
    if (configs.some(isLocalFont)) {
        console.error(`[rmg-runtime] Unable to load multiple FontFace for the same family ${family}`);
        return false;
    }
    const fonts: LoadedFont[] = [];
    configs.forEach(config => {
        const font = new FontFace(family, config.source, config.descriptors);
        document.fonts.add(font);
        fonts.push({ ...config, font });
    });
    loadedFonts[family] = fonts;
    return true;
};

const loadFont = async (
    family: string,
    ...configs: (FontFaceConfig | FontFaceConfig[])[]
): Promise<undefined | LoadedFont | LoadedFont[]> => {
    if (family in loadedFonts) {
        // TODO: consider different weight of the same font?
        return loadedFonts[family];
    }
    for (const config of configs) {
        const result = Array.isArray(config)
            ? await loadMultipleFontFaces(family, config)
            : await loadSingleFontFace(family, config);
        if (result) break;
    }
    return loadedFonts[family];
};

export default {
    getLoadedFonts,
    _resetLoadedFonts,
    loadFont,
};
