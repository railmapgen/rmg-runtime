import { afterEach, beforeAll } from 'vitest';
import channel, { RMG_RUNTIME_CHANNEL_NAME } from './channel';

describe('Channel', () => {
    let testChannel: BroadcastChannel;
    let testChannelReceives: any[] = [];

    beforeAll(() => {
        testChannel = new BroadcastChannel(RMG_RUNTIME_CHANNEL_NAME);
        testChannel.onmessage = ev => testChannelReceives.push(ev.data);
    });

    afterEach(() => {
        testChannelReceives = [];
    });

    it('Can emit event as expected', () => {
        channel.postEvent('SET_LANGUAGE', 'en', true);

        expect(testChannelReceives).toHaveLength(1);
        expect(testChannelReceives).toContainEqual({ event: 'SET_LANGUAGE', data: 'en' });
    });

    it('Can receive registered event as expected', async () => {
        const channelReceives: any[] = [];
        channel.onMessage('SET_LANGUAGE', data => channelReceives.push(data));

        testChannel.postMessage({ event: 'SET_LANGUAGE', data: 'en' });
        testChannel.postMessage({ event: 'SET_COLOUR_MODE', data: 'system' });

        expect(channelReceives).toHaveLength(1);
        expect(channelReceives).toContain('en');
    });
});
