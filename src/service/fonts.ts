import { readBlobAsDataURL } from '../util/util';

type FontFaceConfig = {
    source: string;
    descriptors?: FontFaceDescriptors;
};

type LoadedFont = FontFaceConfig & {
    font: FontFace;
};

let loadedFonts: Record<string, LoadedFont[]> = {};
const getLoadedFonts = () => loadedFonts;
const _resetLoadedFonts = () => (loadedFonts = {});

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
): Promise<undefined | LoadedFont[]> => {
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
                        `[rmg-runtime] Font family ${family} is not loaded completely. Some FontFaceRules may be missing`
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
    getLoadedFonts,
    _resetLoadedFonts,
    loadFont,
    getFontCSS,
};
