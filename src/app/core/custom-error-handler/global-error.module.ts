import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';
import { ErrorService } from './services/error-service';
import { MyCustomErrorHandler } from './services/global-error-handler.service';
import { LoggingService } from './services/logger-service';
import { NotificationService } from './services/notification-service';

@NgModule({
    imports: [CommonModule],
    providers: [
        {
            provide: ErrorHandler,
            useClass: MyCustomErrorHandler,
        },
        NotificationService,
        LoggingService,
        ErrorService,
    ],
    declarations: [],
})
export class WebErrorHandlerModule {}
