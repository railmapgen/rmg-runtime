export enum RmgEnv {
    DEV = 'DEV',
    UAT = 'UAT',
    PRD = 'PRD',
}

export type RmgInstance = 'GitHub' | 'GitLab' | 'Gitee' | 'Tauri' | 'localhost' | 'unknown';
