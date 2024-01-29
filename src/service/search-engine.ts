const injectNoindexRule = () => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
};

export default {
    injectNoindexRule,
};
