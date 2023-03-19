/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable()
export class PlatformProvider {
    public constructor(private platform: Platform) {}

    public getPlatform(): PlatformName {
        if (this.platform.is('android')) {
            return PlatformName.ANDROID;
        }

        if (this.platform.is('ios')) {
            return PlatformName.IOS;
        }

        return PlatformName.WEB;
    }
}

export enum PlatformName {
    IOS,
    ANDROID,
    WEB,
}
