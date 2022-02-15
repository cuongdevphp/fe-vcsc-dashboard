import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { CommonLayoutComponent } from "./layouts/common-layout/common-layout.component";
import { NotFoundComponent } from './not-found/not-found.component';
import { CommonLayout_ROUTES } from "./shared/routes/common-layout.routes";

const loginModule = () => import('./login/login.module').then(x => x.LoginModule);
const appRoutes: Routes = [
    { path: 'login', loadChildren: loginModule },
    {
        path: '',
        redirectTo: '/dashboard/home',
        pathMatch: 'full',
    },
    // {
    //     path: '**', 
    //     redirectTo: '/dashboard/default',
    // },
    {
        path: '', 
        component: CommonLayoutComponent,
        children: CommonLayout_ROUTES,
    },
    {path: '**', component: NotFoundComponent},
    // { 
    //     path: '', 
    //     component: FullLayoutComponent, 
    //     children: FullLayout_ROUTES
    // }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, { 
            preloadingStrategy: PreloadAllModules,
            anchorScrolling: 'enabled',
            scrollPositionRestoration: 'enabled' 
        })
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule {
}