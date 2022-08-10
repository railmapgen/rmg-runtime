import rmgRuntime from '../dist/index.js';

const $ = document.querySelector.bind(document);

$('#root').textContent += 'Instance: ' + rmgRuntime.getInstance();
