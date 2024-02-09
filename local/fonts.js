import rmgRuntime from '../src';

const $ = document.querySelector.bind(document);

const FONTS = ['MyriadPro-Semibold', 'Vegur-Regular', 'Vegur-Bold', 'GenYoMinTW-SB'];

$('#load').addEventListener('click', async () => {
    await Promise.all(
        FONTS.map(async family => {
            const font = await rmgRuntime.loadFont(family);
            if (font) {
                const li = document.createElement('li');
                li.textContent = `${font.displayName ?? family} ${font.configs.map(f => f.source).join(', ')}`;
                li.style.fontFamily = `"${family}", Arial`;
                $('ul').appendChild(li);
            }
        })
    );
});

$('#download').addEventListener('click', async () => {
    FONTS.forEach(family => {
        rmgRuntime.getFontCSS(family).then(console.log);
    });
});
