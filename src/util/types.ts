import { RmgEnv, RmgInstance } from './rmg-types';

export interface RmgRuntimeInfoConfig {
    component: string;
    version: string;
    environment: RmgEnv;
    instance: RmgInstance;
}

export type ChannelEventHandler = (data: any, frameId?: string) => void;

export enum Events {
    SET_LANGUAGE = 'SET_LANGUAGE',
    SET_COLOUR_MODE = 'SET_COLOUR_MODE',
    OPEN_APP = 'OPEN_APP',
    UPDATE_URL = 'UPDATE_URL',
}
