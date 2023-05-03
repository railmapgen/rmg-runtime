import { RmgEnv, RmgInstance } from './rmg-types';

export interface RmgRuntimeInfoConfig {
    component: string;
    version: string;
    environment: RmgEnv;
    instance: RmgInstance;
}

export type ChannelEventHandler<T> = (data: T, frameId?: string) => void;

export type Events = 'SET_LANGUAGE' | 'SET_COLOUR_MODE' | 'OPEN_APP' | 'CLOSE_APP' | 'UPDATE_URL' | 'TOGGLE_NAV_MENU';
