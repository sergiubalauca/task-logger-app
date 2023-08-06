import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface CacheOptions {
    // we may add additional parameters here
    duration?: number;
}

export function cache(params: CacheOptions = {}) {
    const defaultValues: Partial<CacheOptions> = {
        duration: 3000,
    };

    params = {
        ...defaultValues,
        ...params,
    };

    let originalFunc: () => Promise<any> | Observable<any> | any;

    let result: Promise<any> | Observable<any> | any;
    let value: any;
    let funcType: string;
    let cacheUntil: Date;

    let inProgress = false;

    const cacheValue = (val, now) => {
        console.log('caching ', funcType);
        cacheUntil = new Date(now.getTime() + params.duration);
        value = val;
    };

    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        originalFunc = descriptor.value;
        descriptor.value = (args) => {
            const now = new Date();
            if (value && cacheUntil && cacheUntil > now) {
                console.log('from cache');
                switch (funcType) {
                    case 'observable':
                        return of(value);
                    case 'promise':
                        return Promise.resolve(value);
                    default:
                        return value;
                }
            }

            if (inProgress) {
                return result;
            }
            inProgress = true;
            result = originalFunc.apply(this, args);

            if (result instanceof Observable) {
                funcType = 'observable';
                return result.pipe(
                    tap((val) => {
                        cacheValue(val, now);
                        inProgress = false;
                    })
                );
            } else if (result instanceof Promise) {
                funcType = 'promise';
                return result.then((val) => {
                    cacheValue(val, now);
                    inProgress = false;
                    return val;
                });
            } else {
                funcType = 'value';
                cacheValue(result, now);
                inProgress = false;
                return result;
            }
        };
    };
}
