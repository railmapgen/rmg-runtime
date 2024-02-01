import config from './config';

const injectNoindexRule = () => {
    if (config.getEnvironment() !== 'PRD' || !config.isRMT()) {
        if (!document.querySelector('meta[name="robots"]')) {
            console.log('[runtime] Injecting noindex meta tag as this app is not PRD RMT.');
            const meta = document.createElement('meta');
            meta.name = 'robots';
            meta.content = 'noindex';
            document.head.appendChild(meta);
        } else {
            console.log('[runtime] Noindex meta tag already presents.');
        }
    }
};

export default {
    injectNoindexRule,
};
