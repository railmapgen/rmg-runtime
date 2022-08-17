import rmgRuntime from '../dist/index.js';

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
    while (!rmgRuntime.isReady()) {
        $('#root').textContent += 'rmgRuntime is not yet ready...\n';
        await waitFor(300);
    }

    const ul = document.createElement('ul');
    $('#root').append(ul);

    addListItem(ul, 'appName', rmgRuntime.getAppName());
    addListItem(ul, 'appVersion', rmgRuntime.getAppVersion());
    addListItem(ul, 'env', rmgRuntime.getEnv());
    addListItem(ul, 'instance', rmgRuntime.getInstance());
    addListItem(ul, 'msSinceStartUp', rmgRuntime.getMsSinceStartUp());
};

waitFor(Math.random() * 3000).then(() => {
    return start();
});
