import config from './config';
import storage from './storage';

let mockStore: Record<string, string> = {};

const resetMockStore = () => {
    mockStore = {
        rmg__item1: 'value1',
        'rmg-runtime__item1': 'value1',
        'rmg-runtime__item2': 'value2',
        rmg__item2: 'value2',
    };
};

const windowSpy = jest.spyOn(window, 'window', 'get');
const configSpy = jest.spyOn(config, 'getComponent');

describe('Storage', () => {
    beforeAll(() => {
        windowSpy.mockImplementation(
            () =>
                ({
                    localStorage: {
                        getItem: (key: string) => mockStore[key],
                        setItem: (key: string, value: string) => (mockStore[key] = value),
                        removeItem: (key: string) => delete mockStore[key],
                        key: (index: number) => Object.keys(mockStore)[index],
                        length: Object.keys(mockStore).length,
                    },
                } as any)
        );

        configSpy.mockReturnValue('rmg-runtime');
    });

    beforeEach(() => {
        resetMockStore();
    });

    it('Can clear storage based on app name as expected', () => {
        expect(Object.keys(mockStore)).toHaveLength(4);
        expect(Object.keys(mockStore)).toContainEqual(expect.stringMatching(/^rmg-runtime__/));

        storage.clearStorageForCurrentApp();

        expect(Object.keys(mockStore)).toHaveLength(2);
        expect(Object.keys(mockStore)).not.toContainEqual(expect.stringMatching(/^rmg-runtime__/));
    });
});
