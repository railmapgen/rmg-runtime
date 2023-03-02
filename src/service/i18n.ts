import i18n, { Module, Resource } from 'i18next';
import settings from './settings';

const registerLanguageChangeListener = () => {
    settings.onLanguageChange(language => i18n.changeLanguage(language));
};

export class I18nBuilder {
    _appName = 'RMG';
    _lng: string | undefined = undefined;
    readonly _defaultResources: Resource = {};
    readonly _resources: Resource = {};

    constructor() {
        // do nothing
    }

    use(module: Module): I18nBuilder {
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
        i18n.init({
            lng: this._lng,
            fallbackLng: {
                'zh-CN': ['zh-Hans', 'en'],
                'zh-HK': ['zh-Hant', 'en'],
                'zh-TW': ['zh-Hant', 'en'],
                'zh-Hant': ['zh-HK', 'zh-TW', 'en'],
                default: ['en'],
            },
            resources: this.combineResource(),
        })
            .then(t => {
                document.title = t(this._appName);
                document.documentElement.lang = i18n.language;
            })
            .catch(err => {
                console.error('[rmg-runtime] unexpected error occurs while initialising i18n', err);
            });

        i18n.on('languageChanged', lng => {
            document.title = i18n.t(this._appName);
            document.documentElement.lang = lng;
        });

        registerLanguageChangeListener();
        return i18n;
    }
}
