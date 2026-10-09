import {inject} from '@angular/core';import {CanActivateFn,Router} from '@angular/router';import {AuthService} from './auth.service';
export const authGuard:CanActivateFn=async()=>{const auth=inject(AuthService);const router=inject(Router);await auth.whenReady;return auth.user()?true:router.createUrlTree(['/login'],{queryParams:{returnUrl:'/pm-faciliter/member'}})};
