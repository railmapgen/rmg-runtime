import config from './config';
import { RmgEnv } from '../util/rmg-types';
import logger from './logger';

(window as any).dataLayer = (window as any).dataLayer || [];

const installGtag = () => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-2HP8Y4MRRQ';
    document.head.append(script);
};

function gtag(...args: any) {
    if (config.getEnvironment() !== RmgEnv.DEV) {
        // eslint-disable-next-line prefer-rest-params
        return (window as any).dataLayer.push(arguments);
    } else {
        logger.info('Not going to send event in DEV environment', args);
    }
}

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
