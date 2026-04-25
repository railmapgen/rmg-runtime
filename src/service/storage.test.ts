import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import 'global-jsdom/register';
import config from './config.ts';
import storage from './storage.ts';

describe('Storage', () => {
    beforeEach(() => {
        window.localStorage.setItem('rmg__item1', 'value1');
        window.localStorage.setItem('rmg-runtime__item1', 'value1');
        window.localStorage.setItem('rmg-runtime__item2', 'value2');
        window.localStorage.setItem('rmg__item2', 'value2');

        mock.method(config, 'getComponent', () => 'rmg-runtime');
    });

    afterEach(() => {
        window.localStorage.clear();
    });

    it('Can dump storage based on app name as expected', () => {
        const store = storage.getAll();
        assert.equal(Object.keys(store).length, 2);
        assert.partialDeepStrictEqual(store, { 'rmg-runtime__item1': 'value1' });
        assert.partialDeepStrictEqual(store, { 'rmg-runtime__item2': 'value2' });
    });

    it('Can clear storage based on app name as expected', () => {
        assert.equal(window.localStorage.length, 4);
        assert.ok(window.localStorage.getItem('rmg-runtime__item1'));
        assert.ok(window.localStorage.getItem('rmg-runtime__item2'));

        storage.clear();

        assert.equal(window.localStorage.length, 2);
        assert.equal(window.localStorage.getItem('rmg-runtime__item1'), null);
        assert.equal(window.localStorage.getItem('rmg-runtime__item2'), null);
    });

    it('Can listen to storage event', t => {
        const mockHandler1 = t.mock.fn();
        const mockHandler2 = t.mock.fn();
        const mockHandler3 = t.mock.fn();

        storage.on('item3', mockHandler1);
        storage.on('item3', mockHandler2);
        storage.on('item4', mockHandler3);

        window.dispatchEvent(
            new StorageEvent('storage', { key: 'rmg-runtime__item3', oldValue: '123', newValue: 'abc' })
        );

        assert.equal(mockHandler1.mock.callCount(), 1);
        assert.equal(mockHandler1.mock.calls[0].arguments[0], 'abc');
        assert.equal(mockHandler2.mock.callCount(), 1);
        assert.equal(mockHandler2.mock.calls[0].arguments[0], 'abc');
        assert.equal(mockHandler3.mock.callCount(), 0);
    });
});
