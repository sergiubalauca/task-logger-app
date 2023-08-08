import { Injectable, NgZone } from '@angular/core';
// import { NetworkStatus } from '@capacitor/core';
import { ConnectionType, ConnectionStatus } from '@capacitor/network';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

import { ConnectivityState } from './connectivity-state.model';

@Injectable()
export class ConnectivityStateService {
    private connectivitySubject: BehaviorSubject<ConnectivityState> =
        new BehaviorSubject(new ConnectivityState('unknown'));

    public constructor(
        private ngZone: NgZone,
        private toastController: ToastController
    ) {}

    public get connectivity$(): Observable<ConnectivityState> {
        return this.connectivitySubject.asObservable();
    }

    public changeWifiConnectivity(status: ConnectionStatus): void {
        const newType = this.getConnectionType(status);
        const newConnectivity = new ConnectivityState(newType);

        if (
            newConnectivity.connectionType ===
            this.connectivitySubject.value.connectionType
        ) {
            return;
        }

        this.ngZone.run(async () => {
            this.connectivitySubject.next(newConnectivity);
            console.log(
                'Network type switched to ',
                this.connectivitySubject.value,
                '(' + status.connectionType + ')'
            );

            const toast = await this.toastController.create({
                message: `You are now ${newType}`,
                duration: 3000,
                position: 'bottom',
            });
            await toast.present();
        });
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

        return 'unknown';
    }
}
