import { RmgEnv, RmgInstance } from './rmg-types';

export interface RmgRuntimeInfoConfig {
    component: string;
    version: string;
    environment: RmgEnv;
    instance: RmgInstance;
}

export type ChannelEventHandler = (data: any) => void;

export enum Events {
    SET_LANGUAGE = 'SET_LANGUAGE',
    OPEN_APP = 'OPEN_APP',
}
