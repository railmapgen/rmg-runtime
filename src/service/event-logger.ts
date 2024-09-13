import config from './config';
import { RmgEnv } from '../util/rmg-types';
import logger from './logger';

declare global {
    interface Window {
        dataLayer: unknown[];
    }
}
window.dataLayer = window.dataLayer || [];

const installGtag = () => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-2HP8Y4MRRQ';
    document.head.append(script);
};

function gtag(...args: unknown[]) {
    if (config.getEnvironment() !== RmgEnv.DEV) {
        // eslint-disable-next-line prefer-rest-params
        return window.dataLayer.push(arguments);
    } else {
        logger.info('Not going to send event in DEV environment', args);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customEvent = (type: string, data: Record<string, any> = {}) => {
    gtag('event', type, data);
};

const init = () => {
    installGtag();

    gtag('js', new Date());
    gtag('config', 'G-2HP8Y4MRRQ', {
        appName: config.getComponent(),
        version: config.getVersion(),
        environment: config.getEnvironment(),
        instance: config.getInstance(),
    });
};

export default { init, customEvent };
