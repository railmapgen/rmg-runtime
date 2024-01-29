import config from './config';
import { UNKNOWN_COMPONENT } from '../util/constant';

type StorageEventHandler = (value: string | null) => void;
const eventListeners: Partial<Record<string, StorageEventHandler[]>> = {};

const getPrefix = (): string => {
    const component = config.getComponent();
    if (component === UNKNOWN_COMPONENT) {
        throw new Error('[rmg-runtime] Unable to clear storage for unknown app');
    }
    return component;
};

window.addEventListener('storage', ev => {
    const { key, newValue } = ev;
    if (key) {
        eventListeners[key]?.forEach(cb => cb(newValue));
    }
});

const on = (key: string, callback: StorageEventHandler) => {
    const storageKey = `${getPrefix()}__${key}`;
    if (!(storageKey in eventListeners)) {
        eventListeners[storageKey] = [callback];
    } else {
        eventListeners[storageKey]?.push(callback);
    }
};

const get = (key: string): string | null => {
    const prefix = getPrefix();
    return window.localStorage.getItem(`${prefix}__${key}`);
};

const getAll = (): Record<string, string> => {
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

const set = (key: string, value: string) => {
    const prefix = getPrefix();
    window.localStorage.setItem(`${prefix}__${key}`, value);
};

const remove = (key: string) => {
    const prefix = getPrefix();
    window.localStorage.removeItem(`${prefix}__${key}`);
};

const clear = () => {
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

export default { on, get, getAll, set, remove, clear };
