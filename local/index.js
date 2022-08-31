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
    const ul = document.createElement('ul');
    $('#root').append(ul);

    rmgRuntime.getAppName().then(value => addListItem(ul, 'appName', value));
    rmgRuntime.getAppVersion().then(value => addListItem(ul, 'appVersion', value));
    rmgRuntime.getEnv().then(value => addListItem(ul, 'env', value));
    rmgRuntime.getInstance().then(value => addListItem(ul, 'instance', value));
    addListItem(ul, 'msSinceStartUp', rmgRuntime.getMsSinceStartUp());
    addListItem(ul, 'isStandaloneWindow', rmgRuntime.isStandaloneWindow());
};

waitFor(Math.random() * 3000).then(() => {
    return start();
});
