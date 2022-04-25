import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FollowerComponent } from './follower/follower.component';
import { IncomComponent } from './incom/incom.component';

import { TemplateComponent } from './template/template.component';

const routes: Routes = [
    {
        path: 'template',
        component: TemplateComponent,
        data: {
            title: 'Template'
        }
    },
    {
        path: 'follower',
        component: FollowerComponent,
        data: {
            title: 'Follower'
        }
    },
    {
        path: 'incom',
        component: IncomComponent,
        data: {
            title: 'Incom'
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ZnsRoutingModule { }
