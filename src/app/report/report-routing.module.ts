import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesComponent } from './sales/sales.component';

const routes: Routes = [
    {
        path: 'sales',
        component: SalesComponent,
        data: {
            title: 'sales'
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportRoutingModule { }
