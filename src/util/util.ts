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

// https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
export const hashCode = (str: string): number => {
    // java String#hashCode
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
};

export const intToRGB = (i: number): string => {
    const c = (i & 0x00ffffff).toString(16).toUpperCase();

    return '#' + '00000'.substring(0, 6 - c.length) + c;
};
