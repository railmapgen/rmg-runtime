import rmgRuntime from '../dist/index.js';

const $ = document.querySelector.bind(document);

$('#frame').innerHTML += 'isStandaloneWindow: ' + rmgRuntime.isStandaloneWindow();
rmgRuntime.injectCss();

rmgRuntime.onLanguageChange(data => console.log('Changing language to', data));
rmgRuntime.onAppOpen(data => console.log('Opening app', data));
