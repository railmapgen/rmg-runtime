import { ChannelEventHandler, Events } from '../util/types';

const RMG_RUNTIME_CHANNEL_NAME = 'rmg-runtime-channel';

const eventListeners: Partial<Record<Events, ChannelEventHandler[]>> = {};
const channel = new BroadcastChannel(RMG_RUNTIME_CHANNEL_NAME);
channel.onmessage = ev => {
    const { event, data, frameId } = ev.data;
    eventListeners[event as Events]?.forEach(cb => cb(data, frameId));
};

const postEvent = (event: Events, data: any) => {
    channel.postMessage({ event, data, frameId: window.frameElement?.id });
};

const onMessage = (event: Events, callback: ChannelEventHandler) => {
    if (!(event in eventListeners)) {
        eventListeners[event] = [callback];
    } else {
        eventListeners[event]?.push(callback);
    }
};

export default { postEvent, onMessage };
