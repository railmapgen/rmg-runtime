import { vi } from 'vitest';
import { MockBroadcastChannel } from './mock-broadcast-channel';

global.fetch = () => {
    return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
    }) as any;
};

vi.stubGlobal('BroadcastChannel', MockBroadcastChannel);
