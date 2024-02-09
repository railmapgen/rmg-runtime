import { createCachedPromise, readBlobAsDataURL } from '../util/util';

type FontFaceConfig = {
    source: string;
    descriptors?: FontFaceDescriptors;
};

type FontFaceDefinition = {
    displayName?: string;
    url?: string;
    /**
     * A list of fallback loading options of the font. Each option can be a single
     * FontFace constructor arguments or multiple constructor arguments.
     */
    configs: (FontFaceConfig | FontFaceConfig[])[];
};

type LoadedFont = Omit<FontFaceDefinition, 'configs'> & {
    configs: (FontFaceConfig & { font: FontFace })[];
};

let loadedFonts: Record<string, LoadedFont> = {};
const getLoadedFonts = () => loadedFonts;
export const _resetLoadedFonts = () => (loadedFonts = {});

const isLocalFont = (config: FontFaceConfig) => config.source.startsWith('local');
const getFontFaceUrl = (config: FontFaceConfig) => {
    const path = config.source.match(/url\(['"](\S+)['"]\)/)?.[1];
    if (!path) {
        throw new Error('Invalid URL in source ' + config.source);
    }
    return new URL(path, window.location.href);
};
const getCssFontFaceRule = (family: string, config: FontFaceConfig) => `@font-face {
    font-family: '${family}';
    src: ${config.source};
    ${Object.entries(config.descriptors ?? {})
        .map(([k, v]) => `${k}: ${v};`)
        .join('\n')}
}`;

const createGetAllFontsPromise = () =>
    createCachedPromise(() =>
        fetch('/fonts/config.json').then(res => res.json() as Promise<Record<string, FontFaceDefinition>>)
    );

let getAllFonts = createGetAllFontsPromise();
export const _resetGetAllFonts = () => (getAllFonts = createGetAllFontsPromise());

const loadSingleFontFace = async (family: string, config: FontFaceConfig): Promise<boolean> => {
    try {
        const font = new FontFace(family, config.source, config.descriptors);
        if (isLocalFont(config)) {
            await font.load();
        }
        document.fonts.add(font);
        loadedFonts[family] = { configs: [{ ...config, font }] };
        return true;
    } catch (e) {
        console.warn(`[runtime] Failed to load font ${family} with source ${config.source}`, e);
        return false;
    }
};

const loadMultipleFontFaces = async (family: string, configs: FontFaceConfig[]): Promise<boolean> => {
    if (configs.some(isLocalFont)) {
        console.error(`[runtime] Unable to load multiple FontFace for the same family ${family}`);
        return false;
    }
    const fonts: LoadedFont['configs'] = [];
    configs.forEach(config => {
        const font = new FontFace(family, config.source, config.descriptors);
        document.fonts.add(font);
        fonts.push({ ...config, font });
    });
    loadedFonts[family] = { configs: fonts };
    return true;
};

const loadFont = async (family: string, definition?: FontFaceDefinition): Promise<undefined | LoadedFont> => {
    if (family in loadedFonts) {
        // use PostScript name as family name to avoid font-weight conflict
        return loadedFonts[family];
    }

    let parsedDefinition: FontFaceDefinition;
    if (definition) {
        parsedDefinition = definition;
    } else {
        try {
            parsedDefinition = (await getAllFonts())[family];
        } catch (e) {
            throw new Error('Unable to load font definition of ' + family);
        }
    }

    for (const config of parsedDefinition.configs) {
        const result = Array.isArray(config)
            ? await loadMultipleFontFaces(family, config)
            : await loadSingleFontFace(family, config);
        if (result) break;
    }

    if (loadedFonts[family]) {
        loadedFonts[family].displayName = parsedDefinition.displayName;
        loadedFonts[family].url = parsedDefinition.url;
        return loadedFonts[family];
    } else {
        return;
    }
};

const getFontCSS = async (family: string) => {
    const fonts = loadedFonts[family];
    if (!fonts) {
        throw new Error(`Font family ${family} is not loaded`);
    }
    const rules = await Promise.all(
        fonts.configs
            .filter(font => {
                const isLoaded = font.font.status === 'loaded';
                if (!isLoaded) {
                    console.warn(
                        `[runtime] Font family ${family} is not loaded completely. Some FontFaceRules may be missing`
                    );
                }
                return isLoaded;
            })
            .map(async font => {
                if (isLocalFont(font)) {
                    return getCssFontFaceRule(family, font);
                }
                const url = getFontFaceUrl(font);
                const fontResp = await fetch(url);
                const fontDataUri = await readBlobAsDataURL(await fontResp.blob());
                return getCssFontFaceRule(family, { ...font, source: `url('${fontDataUri}')` });
            })
    );
    return rules.join('\n\n');
};

export default {
    getAllFonts,
    getLoadedFonts,
    loadFont,
    getFontCSS,
};
