import config from './config';

const clearStorageForCurrentApp = () => {
    let prefix = config.getComponent();
    if (prefix === 'rmg-unknown') {
        console.log('[rmg-runtime] Unable to clear storage for unknown app');
        return;
    }

    if (prefix === 'railmapgen.github.io') {
        prefix = 'rmg-home';
    }

    let count = 0;
    while (count < window.localStorage.length) {
        const key = window.localStorage.key(count);
        if (key?.startsWith(prefix + '__')) {
            window.localStorage.removeItem(key);
            console.log(`[rmg-runtime] Removed item ${key}`);
        } else {
            count++;
        }
    }
};

export default { clearStorageForCurrentApp };
