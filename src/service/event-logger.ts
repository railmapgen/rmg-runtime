import { waitFor } from '../util/util';
import config from './config';

let dataLayer: any = [];

const installGtag = () => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-2HP8Y4MRRQ';
    document.head.append(script);
};

const waitForSettled = async () => {
    const MAX_ATTEMPTS = 20;
    let attempt = 0;

    while (attempt++ < MAX_ATTEMPTS) {
        if ((window as any).dataLayer) {
            dataLayer = (window as any).dataLayer;
            return;
        } else {
            console.log(`[rmg-runtime] EventLogger is not ready yet. Attempt: ${attempt}/${MAX_ATTEMPTS}`);
            await waitFor(500);
        }
    }

    console.error('[rmg-runtime] Failed to load EventLogger after 10 seconds');
    return;
};

const gtag = (...args: any) => {
    dataLayer.push(args);
};

const customEvent = (type: string, data: Record<string, any>) => {
    gtag('event', type, {
        appName: config.getComponent(),
        version: config.getVersion(),
        environment: config.getEnvironment(),
        instance: config.getInstance(),
        ...data,
    });
};

const start = async () => {
    installGtag();
    await waitForSettled();
    gtag('js', new Date());
    gtag('config', 'G-2HP8Y4MRRQ');
};

start().then();

export default { customEvent };
