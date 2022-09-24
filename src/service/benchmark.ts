import config from './config';

const moduleStartTime = new Date().getTime();

function getMsSinceStartUp(): number {
    const component = config.getComponent();
    const componentStartTime = window.localStorage.getItem(component + '__startTime');

    if (componentStartTime === null) {
        return new Date().getTime() - moduleStartTime;
    } else {
        return new Date().getTime() - Number(componentStartTime);
    }
}

export default { getMsSinceStartUp };
