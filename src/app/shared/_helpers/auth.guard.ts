import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AccountService } from '../services/account.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private accountService: AccountService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.accountService.userValue;
        // console.log(user, 'canActivate')
        // console.log(route, 'ActivatedRouteSnapshot')
        if (user) {

            if(
                route.routeConfig.path !== 'report' && 
                route.routeConfig.path !== 'cs' && 
                user.department !== 'IT'
            ) {
                console.log("vo route chua")
                this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
                return false;
            }
            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}