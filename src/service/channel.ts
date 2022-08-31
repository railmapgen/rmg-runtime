import { ChannelEventHandler, Events } from '../util/types';

const RMG_RUNTIME_CHANNEL_NAME = 'rmg-rumtime-channel';

const eventListeners: Partial<Record<Events, ChannelEventHandler[]>> = {};
const channel = new BroadcastChannel(RMG_RUNTIME_CHANNEL_NAME);
channel.onmessage = ev => {
    const { event, data } = ev.data;
    eventListeners[event as Events]?.forEach(cb => cb(data));
};

const postEvent = (event: Events, data: any) => {
    channel.postMessage({ event, data });
};

const onMessage = (event: Events, callback: ChannelEventHandler) => {
    if (!(event in eventListeners)) {
        eventListeners[event] = [callback];
    } else {
        eventListeners[event]?.push(callback);
    }
};

export default { postEvent, onMessage };
