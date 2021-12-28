import { Component } from '@angular/core'
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { first } from 'rxjs/operators';
import { AccountService } from '../shared/services/account.service';


@Component({
    templateUrl: './login.component.html'
})

export class LoginComponent {
    loading = false;
    loginForm: FormGroup;
    submitted = false;

    submitForm(): void {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }
        this.loading = true;
        this.accountService.login(this.f.userName.value, this.f.password.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.notification.create(
                        'success',
                        'Notification',
                        'Login Success.'
                    );
                    //window.location.href = "/dashboard/default";
                    // window.onload('/dashboard/default');
                    // this.router.navigateByUrl("/dashboard/default")
                    // get return url from query parameters or default to home page
                    //const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard/default';
                    this.router.navigate(['/dashboard/default']);
                    //this.router.navigateByUrl(returnUrl);
                },
                error: error => {
                    this.notification.create(
                        'error',
                        'Notification',
                        'Username or password is wrong'
                    );
                    this.loading = false;
                }
            });
        // for (const i in this.loginForm.controls) {
        //     this.loginForm.controls[ i ].markAsDirty();
        //     this.loginForm.controls[ i ].updateValueAndValidity();
        // }
    }

    constructor(
        private fb: FormBuilder,
        private notification: NzNotificationService,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
    ) {

    }

    get f() { return this.loginForm.controls; }
    ngOnInit(): void {
        this.loginForm = this.fb.group({
            userName: [ null, [ Validators.required ] ],
            password: [ null, [ Validators.required ] ]
        });
    }
}    