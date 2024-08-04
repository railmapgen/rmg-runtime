export enum RmgEnv {
    DEV = 'DEV',
    UAT = 'UAT',
    PRD = 'PRD',
}

export type RmgInstance = 'Org' | 'GitHub' | 'GitLab' | 'Tauri' | 'localhost' | 'unknown';
