import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepositComponent } from './deposit/deposit.component';

const routes: Routes = [
    {
        path: 'deposit',
        component: DepositComponent,
        data: {
            title: 'deposit'
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CsRoutingModule { }
