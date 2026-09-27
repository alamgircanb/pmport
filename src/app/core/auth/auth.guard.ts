import {inject} from '@angular/core';import {CanActivateFn,Router} from '@angular/router';import {AuthService} from './auth.service';
export const authGuard:CanActivateFn=()=>{const auth=inject(AuthService);return auth.user()?true:inject(Router).createUrlTree(['/login'],{queryParams:{returnUrl:'/pm-faciliter/member'}})};
