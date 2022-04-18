import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FollowerComponent } from './follower/follower.component';

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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ZnsRoutingModule { }
