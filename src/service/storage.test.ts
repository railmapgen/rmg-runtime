import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import config from './config';
import storage from './storage';

const configSpy = vi.spyOn(config, 'getComponent');

describe('Storage', () => {
    beforeEach(() => {
        window.localStorage.setItem('rmg__item1', 'value1');
        window.localStorage.setItem('rmg-runtime__item1', 'value1');
        window.localStorage.setItem('rmg-runtime__item2', 'value2');
        window.localStorage.setItem('rmg__item2', 'value2');

        configSpy.mockReturnValue('rmg-runtime');
    });

    afterEach(() => {
        window.localStorage.clear();
    });

    it('Can dump storage based on app name as expected', () => {
        const store = storage.getStorageForCurrentApp();
        expect(Object.keys(store)).toHaveLength(2);
        expect(store).toHaveProperty('rmg-runtime__item1', 'value1');
        expect(store).toHaveProperty('rmg-runtime__item2', 'value2');
    });

    it('Can clear storage based on app name as expected', () => {
        expect(window.localStorage.length).toBe(4);
        expect(window.localStorage.getItem('rmg-runtime__item1')).not.toBeNull();
        expect(window.localStorage.getItem('rmg-runtime__item2')).not.toBeNull();

        storage.clearStorageForCurrentApp();

        expect(window.localStorage.length).toBe(2);
        expect(window.localStorage.getItem('rmg-runtime__item1')).toBeNull();
        expect(window.localStorage.getItem('rmg-runtime__item2')).toBeNull();
    });
});
