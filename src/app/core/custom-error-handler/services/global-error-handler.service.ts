import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { NotificationService } from './notification-service';
import { LoggingService } from './logger-service';
import { ErrorService } from './error-service';

@Injectable()
export class MyCustomErrorHandler implements ErrorHandler {
    // Error handling is important and needs to be loaded first.
    // Because of this we should manually inject the services with Injector.
    constructor(private injector: Injector) {}

    async handleError(error: unknown) {
        const errorService = this.injector.get(ErrorService);
        const logger = this.injector.get(LoggingService);
        const notifier = this.injector.get(NotificationService);

        let message;
        let stackTrace;

        if (error instanceof HttpErrorResponse) {
            // Server Error
            message = errorService.getServerMessage(error);
            stackTrace = errorService.getServerStack(error);
            await notifier.showError(message);
        }
        if (error instanceof Error) {
            // Client Error
            message = errorService.getClientMessage(error);
            stackTrace = errorService.getClientStack(error);
            await notifier.showError(message);
        }

        // Always log errors
        logger.logError(message, stackTrace);

        console.error('GSB GSB: ', error);
    }
}
