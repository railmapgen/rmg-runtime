import { afterEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import 'global-jsdom/register';
import config from './config.ts';
import { waitForMs } from '../util/util.ts';

const successFetchResponse = {
    ok: true,
    status: 200,
    json: async () => ({}),
};

describe('Config', () => {
    afterEach(() => {
        config._resetConfig();
    });

    it('Can resolve correct config path - not slash', async t => {
        const mockFetch = t.mock.method(global, 'fetch', async () => successFetchResponse);

        window.history.pushState({}, '', '/rmg-runtime/my-route');
        assert.equal(window.location.pathname, '/rmg-runtime/my-route');

        await config.loadWithTimeout();

        assert.ok(config.isInitialised());
        assert.equal(mockFetch.mock.callCount(), 1);
        assert.equal(mockFetch.mock.calls[0].arguments[0], '/rmg-runtime/info.json');
    });

    it('Can resolve correct config path - slash', async t => {
        const mockFetch = t.mock.method(global, 'fetch', async () => successFetchResponse);

        window.history.pushState({}, '', '/');
        assert.equal(window.location.pathname, '/');

        await config.loadWithTimeout();

        assert.ok(config.isInitialised());
        assert.equal(mockFetch.mock.callCount(), 1);
        assert.equal(mockFetch.mock.calls[0].arguments[0], '/info.json');
    });

    it('Can catch fetch error as expected', async t => {
        const mockFetch = t.mock.method(global, 'fetch', async () => ({
            ok: false,
            json: async () => ({}),
        }));

        await config.loadWithTimeout();

        assert.equal(config.isInitialised(), false);
        assert.equal(mockFetch.mock.callCount(), 1);
    });

    it('Can timeout after 10 seconds', t => {
        // fetch takes more than 10 seconds
        t.mock.method(global, 'fetch', async () => {
            await waitForMs(11 * 1000);
        });

        t.mock.timers.enable({ apis: ['setTimeout'] });
        config.loadWithTimeout();

        // resolve after 10 seconds
        t.mock.timers.tick(10001);

        assert.equal(config.isInitialised(), false);
    });
});
