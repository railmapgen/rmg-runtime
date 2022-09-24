import rmgRuntime from '../../dist';

const $ = document.querySelector.bind(document);

rmgRuntime.ready().then(() => {
    $('#frame').innerHTML += 'isStandaloneWindow: ' + rmgRuntime.isStandaloneWindow();
    rmgRuntime.injectCss();

    rmgRuntime.onLanguageChange(data => console.log('Changing language to', data));
    rmgRuntime.onAppOpen(data => console.log('Opening app', data));
});
