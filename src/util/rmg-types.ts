export enum RmgEnv {
    DEV = 'DEV',
    UAT = 'UAT',
    PRD = 'PRD',
}

export type RmgInstance = 'Org' | 'GitHub' | 'GitLab' | 'Tauri' | 'localhost' | 'unknown';

type RMNotificationType = 'info' | 'success' | 'warning' | 'error';

export type RMNotification = {
    id: string;
    title: string;
    message: string;
    type: RMNotificationType;
    duration: number;
    source: string;
};
