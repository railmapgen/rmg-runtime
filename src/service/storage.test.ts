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
        const store = storage.getAll();
        expect(Object.keys(store)).toHaveLength(2);
        expect(store).toHaveProperty('rmg-runtime__item1', 'value1');
        expect(store).toHaveProperty('rmg-runtime__item2', 'value2');
    });

    it('Can clear storage based on app name as expected', () => {
        expect(window.localStorage.length).toBe(4);
        expect(window.localStorage.getItem('rmg-runtime__item1')).not.toBeNull();
        expect(window.localStorage.getItem('rmg-runtime__item2')).not.toBeNull();

        storage.clear();

        expect(window.localStorage.length).toBe(2);
        expect(window.localStorage.getItem('rmg-runtime__item1')).toBeNull();
        expect(window.localStorage.getItem('rmg-runtime__item2')).toBeNull();
    });

    it('Can listen to storage event', () => {
        const mockHandler1 = vi.fn();
        const mockHandler2 = vi.fn();
        const mockHandler3 = vi.fn();

        storage.on('item3', mockHandler1);
        storage.on('item3', mockHandler2);
        storage.on('item4', mockHandler3);

        window.dispatchEvent(
            new StorageEvent('storage', { key: 'rmg-runtime__item3', oldValue: '123', newValue: 'abc' })
        );

        expect(mockHandler1).toBeCalledTimes(1);
        expect(mockHandler1).toBeCalledWith('abc');
        expect(mockHandler2).toBeCalledTimes(1);
        expect(mockHandler2).toBeCalledWith('abc');
        expect(mockHandler3).toBeCalledTimes(0);
    });
});
