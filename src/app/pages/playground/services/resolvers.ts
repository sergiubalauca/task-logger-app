import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    ResolveFn,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { RandomUser } from 'src/app/shared/models/random-user';
import { UserService } from './user.service';

export const userResolver: ResolveFn<Observable<RandomUser>> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => inject(UserService).getUser(route.paramMap.get('id'));
