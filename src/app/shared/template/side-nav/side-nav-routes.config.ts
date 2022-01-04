import { SideNavInterface } from '../../interfaces/side-nav.type';

export const ROUTES: SideNavInterface[] = [
    {
        path: '',
        title: 'Dashboard',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'dashboard',
        name: 'dashboard',
        submenu: [
            {
                path: '/dashboard/home',
                title: 'Home',
                iconType: 'nzIcon',
                icon: 'home',
                iconTheme: 'outline',
                name: 'home',
                submenu: [],
            },
            {
                path: '/dashboard/incom',
                title: 'Incom',
                iconType: 'nzIcon',
                icon: 'mobile',
                iconTheme: 'outline',
                name: 'incom',
                submenu: [],
            },
            {
                path: '/dashboard/users',
                title: 'Users',
                iconType: 'nzIcon',
                icon: 'user',
                iconTheme: 'outline',
                name: 'users',
                submenu: [],
            },
            // {
            //     path: '/dashboard/statistics',
            //     title: 'Statistics',
            //     iconType: 'nzIcon',
            //     icon: 'pie-chart',
            //     iconTheme: 'outline',
            //     name: 'statistics',
            //     submenu: [],
            // },
        ]
    },
]    