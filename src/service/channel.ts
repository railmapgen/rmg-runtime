import { ChannelEventHandler } from '../util/types';
import logger from './logger';

export const RMG_RUNTIME_CHANNEL_NAME = 'rmg-runtime-channel';
const eventListeners: Partial<Record<string, ChannelEventHandler<never>[]>> = {};
let channel: BroadcastChannel | undefined;

try {
    channel = new BroadcastChannel(RMG_RUNTIME_CHANNEL_NAME);
    channel.onmessage = ev => {
        const { event, data, frameId } = ev.data;
        eventListeners[event]?.forEach(cb => cb(data as never, frameId));
    };
} catch (e) {
    logger.warn('Failed to initiate broadcast channel. Some features may be unavailable.', e);
}

const postEvent = (event: string, data: unknown) => {
    logger.debug(`Broadcasting event ${event} with data`, data);
    channel?.postMessage({ event, data, frameId: window.frameElement?.id });
};

const onMessage = <T>(event: string, callback: ChannelEventHandler<T>) => {
    if (!(event in eventListeners)) {
        eventListeners[event] = [callback];
    } else {
        eventListeners[event]?.push(callback);
    }
};

export default { postEvent, onMessage };
