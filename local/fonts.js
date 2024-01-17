import rmgRuntime from '../src';

const $ = document.querySelector.bind(document);

const FONTS_MAP = {
    'Myriad Pro': [{ source: 'local(MyriadPro-Regular)' }],
    Vegur: [{ source: 'local(Vegur-Regular)' }, { source: "url('./fonts/Vegur-Regular.otf')" }],
    'GenYoMin TW': [
        { source: 'local(GenYoMinTW-SB)' },
        [
            {
                source: "url('../fonts/GenYoMin-TW-SB.4E.woff2')",
                unicodeRange: 'U+4E00-4FFF',
            },
            {
                source: "url('../fonts/GenYoMin-TW-SB.50.woff2')",
                unicodeRange: 'U+5000-57FF',
            },
            {
                source: "url('../fonts/GenYoMin-TW-SB.58.woff2')",
                unicodeRange: 'U+5800-5FFF',
            },
            {
                source: "url('../fonts/GenYoMin-TW-SB.60.woff2')",
                unicodeRange: 'U+6000-67FF',
            },
        ],
    ],
};

$('#load').addEventListener('click', async () => {
    await Promise.all(
        Object.entries(FONTS_MAP).map(async ([family, config]) => {
            const font = await rmgRuntime.loadFont(family, ...config);
            if (font) {
                const li = document.createElement('li');
                li.textContent = `[SUCCESS/成功] ${family} ${Array.isArray(font) ? font.map(f => f.source).join(', ') : font.source}`;
                li.style.fontFamily = `"${family}", Arial`;
                $('ul').appendChild(li);
            }
        })
    );
});
