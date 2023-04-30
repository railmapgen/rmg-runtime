import rmgRuntime from '../../src';

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

    $('#frame').innerHTML += 'isStandaloneWindow: ' + rmgRuntime.isStandaloneWindow();
    rmgRuntime.injectUITools();

    rmgRuntime.onLanguageChange(data => console.log('Changing language to', data));

    await waitFor(1000);
    rmgRuntime.updateUrl('/rmg?project=123');
    rmgRuntime.openApp('rmg');
});
