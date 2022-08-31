const isStandaloneWindow = () => {
    return !window.frameElement;
};

export default {
    isStandaloneWindow,
};
