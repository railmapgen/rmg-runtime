import rmgRuntime from '../src';

const $ = document.querySelector.bind(document);

const FONTS_MAP = {
    'Myriad Pro': ['local(MyriadPro-Regular)'],
    Vegur: ['local(Vegur-Regular)', "url('./fonts/Vegur-Regular.otf')"],
};

$('#load').addEventListener('click', async () => {
    await Promise.all(
        Object.entries(FONTS_MAP).map(async ([family, sources]) => {
            const source = await rmgRuntime.loadFontWithFallbacks(family, sources);
            if (source) {
                const li = document.createElement('li');
                li.textContent = `[SUCCESS] ${family} ${source}`;
                li.style.fontFamily = family;
                $('ul').appendChild(li);
            }
        })
    );
});
