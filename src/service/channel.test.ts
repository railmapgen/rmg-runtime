import { afterEach, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import 'global-jsdom/register';
import channel, { RMG_RUNTIME_CHANNEL_NAME } from './channel.ts';

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

    it('Can emit event as expected', async t => {
        channel.postEvent('SET_LANGUAGE', 'en');

        await t.waitFor(() => assert.equal(testChannelReceives.length, 1));
        assert.partialDeepStrictEqual(testChannelReceives[0], { event: 'SET_LANGUAGE', data: 'en' });
    });

    it('Can receive registered event as expected', async t => {
        const channelReceives: unknown[] = [];
        channel.onMessage('SET_LANGUAGE', data => channelReceives.push(data));

        testChannel.postMessage({ event: 'SET_LANGUAGE', data: 'en' });
        testChannel.postMessage({ event: 'SET_COLOUR_MODE', data: 'system' });

        await t.waitFor(() => assert.equal(channelReceives.length, 1));
        assert.ok(channelReceives.includes('en'));
    });
});
