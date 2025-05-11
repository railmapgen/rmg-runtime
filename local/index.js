import rmgRuntime, { logger } from '../src';

const $ = document.querySelector.bind(document);

const waitFor = ms => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};

const start = async () => {
    $('#config-list li[data-key="appName"]').textContent += rmgRuntime.getAppName();
    $('#config-list li[data-key="appVersion"]').textContent += rmgRuntime.getAppVersion();
    $('#config-list li[data-key="env"]').textContent += rmgRuntime.getEnv();
    $('#config-list li[data-key="instance"]').textContent += rmgRuntime.getInstance();
    $('#config-list li[data-key="msSinceStartUp"]').textContent += rmgRuntime.getMsSinceStartUp();
    $('#config-list li[data-key="isStandaloneWindow"]').textContent += rmgRuntime.isStandaloneWindow();

    $('#opt-in-ga').addEventListener('click', () => logger.info(rmgRuntime.allowAnalytics(true)));
    $('#opt-out-ga').addEventListener('click', () => logger.info(rmgRuntime.allowAnalytics(false)));

    $('#show-nav').addEventListener('click', () => rmgRuntime.toggleNavMenu(true));
    $('#hide-nav').addEventListener('click', () => rmgRuntime.toggleNavMenu(false));

    // channel testing
    rmgRuntime.onAppMetadataUpdate((data, frameId) =>
        logger.info(`Metadata updated to ${JSON.stringify(data)} from ${frameId}`)
    );
    rmgRuntime.onAppOpen(data => logger.info('Opening app', data));

    rmgRuntime.onNewNotification(data => logger.info('New notification received', data));

    await waitFor(1000);
    rmgRuntime.setLanguage('en');

    new rmgRuntime.I18nBuilder().withAppName('Runtime').build();
};

waitFor(Math.random() * 3000)
    .then(() => {
        return rmgRuntime.ready();
    })
    .then(() => {
        if ($('#root') === null) {
            return;
        }
        return start();
    })
    .then(() => {
        logger.info('App loaded!');
        rmgRuntime.event('APP_LOAD', {});
    });
