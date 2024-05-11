import { hashCode, intToRGB } from '../util/util';
import { UNKNOWN_COMPONENT } from '../util/constant';

let componentPrefix = `[${UNKNOWN_COMPONENT}]`;
let componentRGB: string = intToRGB(hashCode(UNKNOWN_COMPONENT));

const setup = (component: string) => {
    componentPrefix = `[${component}]`;
    componentRGB = intToRGB(hashCode(component));
};

const wrapper =
    (cb: (...data: any[]) => void, prefix?: string, RGB?: string) =>
    (...data: any[]) => {
        if (typeof data[0] === 'string') {
            cb(`%c${prefix ?? componentPrefix}%c ${data[0]}`, `color: ${RGB ?? componentRGB}`, '', ...data.slice(1));
        } else {
            cb(`%c${prefix ?? componentPrefix}%c`, `color: ${RGB ?? componentRGB}`, '', ...data);
        }
    };

const logger = {
    debug: wrapper(console.debug),
    info: wrapper(console.info),
    warn: wrapper(console.warn),
    error: wrapper(console.error),
};

const runtimePrefix = '[runtime]';
const runtimeRGB = intToRGB(hashCode('runtime'));

export default {
    setup,
    logger,
    debug: wrapper(console.debug, runtimePrefix, runtimeRGB),
    info: wrapper(console.info, runtimePrefix, runtimeRGB),
    warn: wrapper(console.warn, runtimePrefix, runtimeRGB),
    error: wrapper(console.error, runtimePrefix, runtimeRGB),
    group: wrapper(console.group, runtimePrefix, runtimeRGB),
    groupEnd: console.groupEnd,
};
