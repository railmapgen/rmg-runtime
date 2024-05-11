import config from './config';
import logger from './logger';

const injectNoindexRule = () => {
    if (config.getEnvironment() !== 'PRD' || !config.isRMT()) {
        if (!document.querySelector('meta[name="robots"]')) {
            logger.info('Injecting noindex meta tag as this app is not PRD RMT.');
            const meta = document.createElement('meta');
            meta.name = 'robots';
            meta.content = 'noindex';
            document.head.appendChild(meta);
        } else {
            logger.info('Noindex meta tag already presents.');
        }
    }
};

export default {
    injectNoindexRule,
};
