import { inject, Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService {
    constructor(
        private authService: AuthService,
        private navController: NavController
    ) {}

    public async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        if (!this.authService.isAuthenticated()) {
            return await this.navController.navigateRoot('/login');

            // return false;
        }
        return true;
    }
}

export const canActivateTeam: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => inject(AuthGuardService).canActivate(route, state);
