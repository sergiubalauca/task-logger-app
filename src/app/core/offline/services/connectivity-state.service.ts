import { Injectable, NgZone } from '@angular/core';
import { ConnectionType, ConnectionStatus } from '@capacitor/network';
import { ToastService } from '@shared';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { OfflineManagerService } from './api-manager.service';

import { ConnectivityState } from './connectivity-state.model';

@Injectable({ providedIn: 'root' })
export class ConnectivityStateService {
    private connectivitySubject: BehaviorSubject<ConnectivityState> =
        new BehaviorSubject(new ConnectivityState('unknown'));

    public constructor(
        private ngZone: NgZone,
        private toastService: ToastService,
        private offlineManagerService: OfflineManagerService
    ) {}

    public get connectivity$(): Observable<ConnectivityState> {
        return this.connectivitySubject.asObservable();
    }

    public changeWifiConnectivity(status: ConnectionStatus): {
        stopSubscription: () => void;
    } {
        const newType = this.getConnectionType(status);
        const newConnectivity = new ConnectivityState(newType);
        let subscription: Subscription;

        if (
            newConnectivity.connectionType ===
            this.connectivitySubject.value.connectionType
        ) {
            return {
                // stopSubscription: () => subscription?.unsubscribe(),
                stopSubscription: () => null,
            };
        }

        this.ngZone.run(async () => {
            this.connectivitySubject.next(newConnectivity);
            console.log(
                'Network type switched to ',
                this.connectivitySubject.value,
                '(' + status.connectionType + ')'
            );

            if (newConnectivity.connectionType !== 'unknown' && newConnectivity.connectionType !== 'none') {
                subscription = this.offlineManagerService
                    .checkForEvents()
                    .subscribe();
            }

            await this.toastService.presentSuccess(
                `You are connected to: ${newType}`,
                3000
            );

            return {
                // stopSubscription: () => subscription?.unsubscribe(),
                stopSubscription: () => null,
            };
        });

        return {
           // stopSubscription: () => subscription?.unsubscribe(),
           stopSubscription: () => null,
        };
    }

    public getConnectivityStatusValue(): boolean | undefined {
        return this.connectivitySubject.value.isConnected;
    }

    private getConnectionType(status: ConnectionStatus): ConnectionType {
        const { connected, connectionType } = status;

        if (connected) {
            if (connectionType === 'wifi') {
                return 'wifi';
            } else {
                // on some devices it does not return 'cellular', but '3g' or '4g'
                // so we assume that if it is not wifi then is 'cellular'
                return 'cellular';
            }
        }

        if (connectionType === 'none') {
            return 'none';
        }

        if (connectionType === 'cellular') {
            return 'cellular';
        }

        return 'unknown';
    }
}
