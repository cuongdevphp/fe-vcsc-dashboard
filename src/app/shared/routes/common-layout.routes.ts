import { Routes } from '@angular/router';
import { AuthGuard } from '../../../app/shared/_helpers/auth.guard';

export const CommonLayout_ROUTES: Routes = [

    //Dashboard
    {
        path: 'dashboard',
        loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard]
    },

    //ZNS
    {
        path: 'zns',
        loadChildren: () => import('../../zns/zns.module').then(m => m.ZnsModule),
        canActivate: [AuthGuard]
    },

    {
        path: '',
        loadChildren: () => import('../../external/external.module').then(m => m.ExternalModule),
        canActivate: []
    },

];