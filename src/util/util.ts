export const waitFor = (ms: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms, `Timeout after ${ms / 1000} seconds`);
    });
};

export const readBlobAsDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve: (value: string) => void) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
};

export const createCachedPromise = <T>(promiseFactory: () => Promise<T>) => {
    let cachedResponse: Promise<T> | null;
    let promisePending = false;
    return async (reload?: boolean): Promise<T> => {
        if (cachedResponse && (promisePending || !reload)) {
            return cachedResponse;
        }
        cachedResponse = promiseFactory();
        promisePending = true;
        return cachedResponse
            .then(response => {
                promisePending = false;
                return response;
            })
            .catch(e => {
                cachedResponse = null;
                throw e;
            });
    };
};
