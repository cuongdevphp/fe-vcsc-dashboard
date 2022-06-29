import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatComponent } from './chat/chat.component';
import { DefaultDashboardComponent } from './default/default-dashboard.component';
import { IncomDashboardComponent } from './incom/incom-dashboard.component';
import { ReportDashboardComponent } from './report/report-dashboard.component';
import { PaymentDashboardComponent } from './payment/payment-dashboard.component';
import { StatisticsDashboardComponent } from './statistics/statistics-dashboard.component';
import { TradingDashboardComponent } from './trading/trading.component';
import { UsersDashboardComponent } from './users/users.component';
let routes: Routes = [
    {
        path: 'home',
        component: DefaultDashboardComponent,
        data: {
            title: 'Dashboard ',
            headerDisplay: "none"
        }
    },
    {
        path: 'chat',
        component: ChatComponent,
        data: {
            title: 'Chat Dashboard ',
            headerDisplay: "none"
        }
    },
    {
        path: 'incom',
        component: IncomDashboardComponent,
        data: {
            title: 'Incom Dashboard ',
            headerDisplay: "none"
        }
    },
    {
        path: 'users',
        component: UsersDashboardComponent,
        data: {
            title: 'Users Dashboard ',
            headerDisplay: "none"
        }
    },
    {
        path: 'statistics',
        component: StatisticsDashboardComponent,
        data: {
            title: 'Statistics Dashboard',
            headerDisplay: "none"
        }
    },
    // {
    //     path: 'trading',
    //     component: TradingDashboardComponent,
    //     data: {
    //         title: 'Trading Dashboard',
    //         headerDisplay: "none"
    //     }
    // },
    {
        path: 'report',
        component: ReportDashboardComponent,
        data: {
            title: 'Report Dashboard',
            headerDisplay: "none"
        }
    },
    {
        path: 'payment',
        component: PaymentDashboardComponent,
        data: {
            title: 'Payment Dashboard',
            headerDisplay: "none"
        }
    },
];

// let user = JSON.parse(localStorage.getItem('user')) || [];
// const menuUser = typeof user.menu !== 'undefined' ? JSON.parse(user.menu) : '';

// if(menuUser) {
//     let subMenu = [];
//     for(const i in routes) {
//         if(menuUser.includes(routes[i].path)) {
//             subMenu.push(routes[i]);
//         }
//     }
//     routes = subMenu;
// }
// console.log(routes, 'routes');
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class DashboardRoutingModule { 
}
