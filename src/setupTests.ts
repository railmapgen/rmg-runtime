global.fetch = vi.fn().mockImplementation(() => {
    return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
    }) as any;
});
