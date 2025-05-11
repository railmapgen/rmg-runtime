import channel from './channel';
import config from './config';
import { ChannelEventHandler } from '../util/types';
import { RMNotification } from '../util/rmg-types';

const NEW_NOTIFICATION = 'NEW_NOTIFICATION';

const sendNotification = (payload: Omit<RMNotification, 'id' | 'source'>) => {
    channel.postEvent(NEW_NOTIFICATION, { ...payload, id: crypto.randomUUID(), source: config.getComponent() });
};

const onNewNotification = (callback: ChannelEventHandler<RMNotification>) => {
    channel.onMessage(NEW_NOTIFICATION, callback);
};

export default { sendNotification, onNewNotification };
