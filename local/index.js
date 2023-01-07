import rmgRuntime from '../src';

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

    $('#opt-in-ga').addEventListener('click', () => console.log(rmgRuntime.allowAnalytics(true)));
    $('#opt-out-ga').addEventListener('click', () => console.log(rmgRuntime.allowAnalytics(false)));

    // channel testing
    rmgRuntime.onUrlUpdate((data, frameId) => console.log(`Url updated to ${data} from ${frameId}`));
    rmgRuntime.onAppOpen(data => console.log('Opening app', data));

    await waitFor(1000);
    rmgRuntime.setLanguage('en');
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
        rmgRuntime.event('APP_LOAD', {});
    });
