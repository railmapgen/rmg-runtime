import config from './config';

(window as any).dataLayer = (window as any).dataLayer || [];

const installGtag = () => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-2HP8Y4MRRQ';
    document.head.append(script);
};

function gtag(...args: any) {
    // eslint-disable-next-line prefer-rest-params
    return (window as any).dataLayer.push(arguments);
}

const customEvent = (type: string, data: Record<string, any>) => {
    gtag('event', type, data);
};

const initLogger = () => {
    installGtag();

    gtag('js', new Date());
    gtag('config', 'G-2HP8Y4MRRQ', {
        appName: config.getComponent(),
        version: config.getVersion(),
        environment: config.getEnvironment(),
        instance: config.getInstance(),
    });
};

config.waitForSettled().then(() => {
    initLogger();
});

export default { customEvent };
