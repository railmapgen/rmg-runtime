import { afterEach, describe, expect, it, vi } from 'vitest';
import config from './config';
import { waitFor } from '../util/util';

const originalFetch = global.fetch;
const mockFetch = vi.fn();

const windowSpy = vi.spyOn(window, 'location', 'get');

describe('Config', () => {
    afterEach(() => {
        config._resetConfig();
        global.fetch = originalFetch;
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    it('Can resolve correct config path - not slash', async () => {
        windowSpy.mockReturnValue({ pathname: '/rmg-runtime/my-route' } as any);

        global.fetch = mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
        await config.waitForSettled();

        expect(config.isInitialised()).toBeTruthy();
        expect(mockFetch).toBeCalledTimes(1);
        expect(mockFetch).toBeCalledWith('/rmg-runtime/info.json');
    });

    it('Can resolve correct config path - slash', async () => {
        windowSpy.mockReturnValue({ pathname: '/' } as any);

        global.fetch = mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
        await config.waitForSettled();

        expect(config.isInitialised()).toBeTruthy();
        expect(mockFetch).toBeCalledTimes(1);
        expect(mockFetch).toBeCalledWith('/info.json');
    });

    it('Can catch fetch error as expected', async () => {
        global.fetch = mockFetch.mockResolvedValue({ ok: false, json: () => Promise.resolve({}) });
        await config.waitForSettled();

        expect(config.isInitialised()).toBeFalsy();
        expect(mockFetch).toBeCalledTimes(1);
    });

    it('Can timeout after 10 seconds', () => {
        // fetch takes more than 10 seconds
        global.fetch = mockFetch.mockImplementation(async () => {
            await waitFor(11 * 1000);
        });

        vi.useFakeTimers();
        config.waitForSettled();

        // resolve after 10 seconds
        vi.advanceTimersByTime(10001);

        expect(config.isInitialised()).toBeFalsy();
    });
});
