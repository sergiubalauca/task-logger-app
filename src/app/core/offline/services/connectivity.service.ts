import { Injectable, NgZone } from '@angular/core';
import { Network } from '@capacitor/network';
import { ConnectivityStateService } from './connectivity-state.service';

@Injectable()
export class ConnectivityService {
    constructor(
        private connectivityStateService: ConnectivityStateService,
        private ngZone: NgZone
    ) {}

    public startCheckConnectivity(): void {
        this.initializeNetworkStatus();
        this.addListenertOnStatusChange();
    }

    private initializeNetworkStatus(): void {
        Network.getStatus().then((status) => {
            this.connectivityStateService
                .changeWifiConnectivity(status)
                .stopSubscription();
        });
    }

    private addListenertOnStatusChange(): void {
        Network.addListener('networkStatusChange', (status) => {
            this.connectivityStateService
                .changeWifiConnectivity(status)
                .stopSubscription();
        });

        this.ngZone.runOutsideAngular(() => {
            // because of Capacitor issues we need to wait few seconds to have accurate connectionType (between 4g and wifi)
            // this is why we will check every 5 seconds for accuracy
            setInterval(() => {
                Network.getStatus().then((status) => {
                    this.connectivityStateService
                        .changeWifiConnectivity(status)
                        .stopSubscription();
                });
            }, 5000);
        });
    }
}
