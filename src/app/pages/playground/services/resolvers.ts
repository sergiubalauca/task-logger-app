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
) => {
    const userService = inject(UserService);
    const id = route.queryParamMap.get('id');
    const paramId = userService.getUser(id);
    return paramId;
};
