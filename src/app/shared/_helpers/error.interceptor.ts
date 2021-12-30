import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AccountService } from '../services/account.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(request.url.search('/login') === -1) {
            request = request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${this.accountService.userValue.token}`,
                    'Content-Type': 'application/json'
                }
            });
        }

        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].includes(err.status) && this.accountService.userValue.token) {
                // auto logout if 401 or 403 response returned from api
                this.accountService.logout();
            }
            return throwError(err);
        }))
    }
}