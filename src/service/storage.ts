import config from './config';

const getPrefix = (): string => {
    const component = config.getComponent();
    if (component === 'rmg-unknown') {
        throw new Error('[rmg-runtime] Unable to clear storage for unknown app');
    }

    if (component === 'railmapgen.github.io') {
        return 'rmg-home';
    }

    return component;
};

const getStorageForCurrentApp = (): Record<string, string> => {
    const prefix = getPrefix();
    const store: Record<string, string> = {};

    let count = 0;
    while (count < window.localStorage.length) {
        const key = window.localStorage.key(count);
        if (key?.startsWith(prefix + '__')) {
            const value = window.localStorage.getItem(key);
            if (value) store[key] = value;
        }
        count++;
    }

    return store;
};

const clearStorageForCurrentApp = () => {
    const prefix = getPrefix();

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

export default { getStorageForCurrentApp, clearStorageForCurrentApp };
