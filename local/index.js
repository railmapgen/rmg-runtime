import rmgRuntime from '../src';

const $ = document.querySelector.bind(document);

const waitFor = ms => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};

const addListItem = (ul, key, value) => {
    const li = document.createElement('li');
    li.textContent = `${key}: ${value}`;
    ul.append(li);
};

const start = async () => {
    const ul = document.createElement('ul');
    $('#root').append(ul);

    // display config
    addListItem(ul, 'appName', rmgRuntime.getAppName());
    addListItem(ul, 'appVersion', rmgRuntime.getAppVersion());
    addListItem(ul, 'env', rmgRuntime.getEnv());
    addListItem(ul, 'instance', rmgRuntime.getInstance());
    addListItem(ul, 'msSinceStartUp', rmgRuntime.getMsSinceStartUp());
    addListItem(ul, 'isStandaloneWindow', rmgRuntime.isStandaloneWindow());

    const optInGA = document.createElement('button');
    optInGA.textContent = 'opt-in GA';
    optInGA.addEventListener('click', () => console.log(rmgRuntime.allowAnalytics(true)));
    $('#root').append(optInGA);

    const optOutGA = document.createElement('button');
    optOutGA.textContent = 'opt-out GA';
    optOutGA.addEventListener('click', () => console.log(rmgRuntime.allowAnalytics(false)));
    $('#root').append(optOutGA);

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
