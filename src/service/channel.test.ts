import channel, { RMG_RUNTIME_CHANNEL_NAME } from './channel';
import { waitFor } from '@testing-library/dom';

describe('Channel', () => {
    let testChannel: BroadcastChannel;
    let testChannelReceives: unknown[] = [];

    beforeEach(() => {
        testChannel = new BroadcastChannel(RMG_RUNTIME_CHANNEL_NAME);
        testChannel.onmessage = ev => testChannelReceives.push(ev.data);
    });

    afterEach(() => {
        testChannel.close();
        testChannelReceives = [];
    });

    it('Can emit event as expected', async () => {
        channel.postEvent('SET_LANGUAGE', 'en');

        await waitFor(() => expect(testChannelReceives).toHaveLength(1));
        expect(testChannelReceives).toContainEqual({ event: 'SET_LANGUAGE', data: 'en' });
    });

    it('Can receive registered event as expected', async () => {
        const channelReceives: unknown[] = [];
        channel.onMessage('SET_LANGUAGE', data => channelReceives.push(data));

        testChannel.postMessage({ event: 'SET_LANGUAGE', data: 'en' });
        testChannel.postMessage({ event: 'SET_COLOUR_MODE', data: 'system' });

        await waitFor(() => expect(channelReceives).toHaveLength(1));
        expect(channelReceives).toContain('en');
    });
});
