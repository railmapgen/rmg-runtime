import rmgRuntime from '../src';

const $ = document.querySelector.bind(document);

const FONTS_MAP = {
    'Myriad Pro': 'Myriad Pro',
    Vegur: 'Vegur',
    'GenYoMin TW': '源樣明體',
};

$('#load').addEventListener('click', async () => {
    await Promise.all(
        Object.entries(FONTS_MAP).map(async ([family, name]) => {
            const font = await rmgRuntime.loadFont(family);
            if (font) {
                const li = document.createElement('li');
                li.textContent = `${name} ${font.map(f => f.source).join(', ')}`;
                li.style.fontFamily = `"${family}", Arial`;
                $('ul').appendChild(li);
            }
        })
    );
});

$('#download').addEventListener('click', async () => {
    Object.keys(FONTS_MAP).forEach(family => {
        rmgRuntime.getFontCSS(family).then(console.log);
    });
});
