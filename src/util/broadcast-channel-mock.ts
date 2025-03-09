type MessageEventHandler = (event: MessageEvent) => void;
const channels: BroadcastChannelMock[] = [];

export class BroadcastChannelMock {
    name: string;
    eventHandlers: MessageEventHandler[] = [];

    constructor(channelName: string) {
        this.name = channelName;
        channels.push(this);
    }

    postMessage(message: unknown) {
        channels.forEach(channel => {
            if (channel !== this && channel.name === this.name) {
                channel.eventHandlers.forEach(handler => handler({ data: message } as MessageEvent));
            }
        });
    }

    set onmessage(handler: MessageEventHandler) {
        this.eventHandlers = [handler];
    }

    set onmessageerror(handler: MessageEventHandler) {
        console.warn('Not implemented');
    }

    addEventListener(type: string, handler: MessageEventHandler) {
        if (type === 'message') {
            this.eventHandlers.push(handler);
        }
    }

    removeEventListener(handler: MessageEventHandler) {
        const index = this.eventHandlers.indexOf(handler);
        if (index > -1) {
            this.eventHandlers.splice(index, 1);
        }
    }

    close() {
        const index = channels.indexOf(this);
        if (index > -1) {
            channels.splice(index, 1);
        }
    }
}

export const setupBroadcastChannelMock = () => {
    global.BroadcastChannel = BroadcastChannelMock as never;
};
