export enum RmgEnv {
    DEV = 'DEV',
    UAT = 'UAT',
    PRD = 'PRD',
}

export enum RmgRuntimeInstance {
    GITHUB = 'GitHub',
    GITLAB = 'GitLab',
    LOCALHOST = 'localhost',
    UNKNOWN = 'unknown',
}

export interface RmgRuntimeInfoConfig {
    component: string;
    version: string;
    environment: RmgEnv;
    instance: RmgRuntimeInstance;
}

export type ChannelEventHandler = (data: any) => void;
export enum Events {
    SET_LANGUAGE = 'SET_LANGUAGE',
    OPEN_APP = 'OPEN_APP',
}
