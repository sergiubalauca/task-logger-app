import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  logError(message: string, stack: string) {
    console.log('LoggingService: ' + message);
  }
}
