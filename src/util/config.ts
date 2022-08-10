const HOSTNAME = window.location.hostname;

export const _getInstance = () => {
    if (HOSTNAME.endsWith('railmapgen.github.io')) {
        return 'GitHub';
    } else if (HOSTNAME.endsWith('railmapgen.gitlab.io')) {
        return 'GitLab';
    } else if (HOSTNAME === 'localhost' || HOSTNAME === '127.0.0.1') {
        return 'localhost';
    } else {
        return 'unknown';
    }
};
