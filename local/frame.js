import rmgRuntime from '../dist/index.js';

const $ = document.querySelector.bind(document);

$('#frame').textContent = 'isStandaloneWindow: ' + rmgRuntime.isStandaloneWindow();
