import i18n, { i18n as II18n, Module, Newable, NewableModule, Resource } from 'i18next';
import settings from './settings';

let i18nInstance: II18n;

export const getI18nInstance = () => i18nInstance;

const registerLanguageChangeListener = (instance: II18n) => {
    settings.onLanguageChange(language => instance.changeLanguage(language));
};

export class I18nBuilder {
    _appName = 'RMG';
    _lng: string | undefined = undefined;
    readonly _defaultResources: Resource = {};
    readonly _resources: Resource = {};

    constructor() {
        // do nothing
    }

    use<T extends Module>(module: T | NewableModule<T> | Newable<T>): I18nBuilder {
        i18n.use(module);
        return this;
    }

    withAppName(appName: string): I18nBuilder {
        this._appName = appName;
        return this;
    }

    withLng(lng: string): I18nBuilder {
        this._lng = lng;
        return this;
    }

    withDefaultResource(resource: Record<string, Record<string, any>>): I18nBuilder {
        Object.entries(resource).forEach(([lang, r]) => {
            this._defaultResources[lang] = r;
        });
        return this;
    }

    withResource(lang: string, additionalResource: Record<string, any>): I18nBuilder {
        this._resources[lang] = additionalResource;
        return this;
    }

    combineResource(): Resource {
        const result: Record<string, { translation: Record<string, any> }> = {};
        Object.entries(this._defaultResources).forEach(([lang, translation]) => {
            result[lang] = { translation };
        });

        // override default translation with custome ones (if any)
        Object.entries(this._resources).forEach(([lang, translation]) => {
            if (lang in result) {
                result[lang].translation = {
                    ...result[lang].translation,
                    ...translation,
                };
            } else {
                result[lang] = { translation };
            }
        });

        return result;
    }

    build() {
        i18nInstance = i18n.createInstance(
            {
                lng: this._lng,
                fallbackLng: {
                    'zh-CN': ['zh-Hans', 'zh-Hant', 'en'],
                    'zh-HK': ['zh-Hant', 'zh-Hans', 'en'],
                    'zh-TW': ['zh-Hant', 'zh-Hans', 'en'],
                    default: ['en'],
                },
                resources: this.combineResource(),
            },
            (err, t) => {
                if (err) {
                    console.error('[runtime] unexpected error occurs while initialising i18n', err);
                    return;
                }
                document.title = t(this._appName);
                document.documentElement.lang = this._lng ?? 'en';
            }
        );

        i18nInstance.on('languageChanged', lng => {
            document.title = i18nInstance.t(this._appName);
            document.documentElement.lang = lng;
        });

        registerLanguageChangeListener(i18nInstance);

        return i18nInstance;
    }
}
