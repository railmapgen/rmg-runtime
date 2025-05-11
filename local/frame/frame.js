import rmgRuntime, { logger } from '../../src';

const $ = document.querySelector.bind(document);

const waitFor = ms => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};

rmgRuntime.ready().then(async () => {
    if ($('#frame') == null) {
        return;
    }

    $('#frame').innerHTML += `<div>isStandaloneWindow: ${rmgRuntime.isStandaloneWindow()}</div>`;
    rmgRuntime.injectUITools();

    $('#notification').addEventListener('click', () => {
        rmgRuntime.sendNotification({
            title: 'Warning',
            message: 'Your device is hacked!',
            type: 'warning',
            duration: 5000,
        });
    });

    rmgRuntime.onLanguageChange(data => logger.info('Changing language to', data));

    await waitFor(1000);
    rmgRuntime.updateAppMetadata({ search: '?project=123' });
    rmgRuntime.openApp('rmg');
});
