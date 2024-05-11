// DO NOT IMPORT config.ts
import { hashCode, intToRGB } from '../util/util';
import { UNKNOWN_COMPONENT } from '../util/constant';

let componentName = UNKNOWN_COMPONENT;
let componentRGB: string = intToRGB(hashCode(UNKNOWN_COMPONENT));

const setup = (component: string) => {
    componentName = component;
    componentRGB = intToRGB(hashCode(component));
};

const getComponentPrefix = () => `[${componentName}]`;
const getComponentRGB = () => componentRGB;

const wrapper =
    (cb: (...data: any[]) => void, prefix: () => string, RGB: () => string) =>
    (...data: any[]) => {
        if (typeof data[0] === 'string') {
            cb(`%c${prefix()}%c ${data[0]}`, `color: ${RGB()}`, '', ...data.slice(1));
        } else {
            cb(`%c${prefix()}%c`, `color: ${RGB()}`, '', ...data);
        }
    };

const logger = {
    debug: wrapper(console.debug, getComponentPrefix, getComponentRGB),
    info: wrapper(console.info, getComponentPrefix, getComponentRGB),
    warn: wrapper(console.warn, getComponentPrefix, getComponentRGB),
    error: wrapper(console.error, getComponentPrefix, getComponentRGB),
};

const getRuntimePrefix = () => (componentName === UNKNOWN_COMPONENT ? `[runtime]` : `[runtime@${componentName}]`);
const runtimeRGB = intToRGB(hashCode('runtime'));
const getRuntimeRGB = () => runtimeRGB;

export default {
    setup,
    logger,
    debug: wrapper(console.debug, getRuntimePrefix, getRuntimeRGB),
    info: wrapper(console.info, getRuntimePrefix, getRuntimeRGB),
    warn: wrapper(console.warn, getRuntimePrefix, getRuntimeRGB),
    error: wrapper(console.error, getRuntimePrefix, getRuntimeRGB),
    group: wrapper(console.group, getRuntimePrefix, getRuntimeRGB),
    groupEnd: console.groupEnd,
};
