import { animationFrameScheduler, from, Observable, of, scheduled } from 'rxjs';
import { bufferCount, map, mergeMap } from 'rxjs/operators';
import { concatMap, delay, scan, tap } from 'rxjs/operators';

export const lazyArray = <T>(delayMs = 0, concurrency = 2) => {
  let isFirstEmission = true;

  return (source$: Observable<T[]>) =>
    source$.pipe(
      map((items) => items),
      mergeMap((items) => {
        if (!isFirstEmission) {
          return of(items);
        }

        const items$ = from(items);

        return items$.pipe(
          bufferCount(concurrency),
          concatMap((value, index) => {
            const delayed = delay(index * delayMs);

            return scheduled(of(value), animationFrameScheduler).pipe(delayed);
          }),
          scan((acc: T[], steps: T[]) => [...acc, ...steps], []),
          tap((scannedItems: T[]) => {
            const scanDidComplete = scannedItems.length === items.length;

            if (scanDidComplete) {
              isFirstEmission = false;
            }
          })
        );
      })
    );
};
