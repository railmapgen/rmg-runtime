import { createCachedPromise, readBlobAsDataURL } from '../util/util';

type FontFaceConfig = {
    source: string;
    descriptors?: FontFaceDescriptors;
};

type FontFaceDefinition = {
    displayName?: string;
    url?: string;
    configs: (FontFaceConfig | FontFaceConfig[])[];
};

type LoadedFont = FontFaceConfig & {
    font: FontFace;
};

let loadedFonts: Record<string, LoadedFont[]> = {};
const getLoadedFonts = () => loadedFonts;
export const _resetLoadedFonts = () => (loadedFonts = {});

const isLocalFont = (config: FontFaceConfig) => config.source.startsWith('local');
const getFontFaceUrl = (config: FontFaceConfig) => {
    const path = config.source.match(/url\(['"](\S+)['"]\)/)?.[1];
    if (!path) {
        throw new Error('Invalid URL in source ' + config.source);
    }
    return new URL(path, window.location.origin);
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
        loadedFonts[family] = [{ ...config, font }];
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
    ...configs: (FontFaceConfig | FontFaceConfig[] | undefined)[]
): Promise<undefined | LoadedFont[]> => {
    if (family in loadedFonts) {
        // TODO: consider different weight of the same font?
        return loadedFonts[family];
    }

    let parsedConfigs: (FontFaceConfig | FontFaceConfig[])[];
    if (configs[0]) {
        parsedConfigs = configs as typeof parsedConfigs;
    } else {
        try {
            const allFonts = await getAllFonts();
            parsedConfigs = allFonts[family].configs;
        } catch (e) {
            throw new Error('Unable to load font definition of ' + family);
        }
    }

    for (const config of parsedConfigs) {
        const result = Array.isArray(config)
            ? await loadMultipleFontFaces(family, config)
            : await loadSingleFontFace(family, config);
        if (result) break;
    }
    return loadedFonts[family];
};

const getFontCSS = async (family: string) => {
    const fonts = loadedFonts[family];
    if (!fonts) {
        throw new Error(`Font family ${family} is not loaded`);
    }
    const rules = await Promise.all(
        fonts
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
