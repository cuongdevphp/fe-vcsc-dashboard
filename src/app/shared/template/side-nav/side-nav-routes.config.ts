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
                path: '/dashboard/default',
                title: 'Default',
                iconType: '',
                icon: '',
                iconTheme: '',
                name: 'default',
                submenu: [],
            },
            {
                path: '/dashboard/incom',
                title: 'Incom',
                iconType: '',
                icon: '',
                iconTheme: '',
                name: 'incom',
                submenu: [],
            },
            {
                path: '/dashboard/users',
                title: 'Users',
                iconType: '',
                icon: '',
                iconTheme: '',
                name: 'users',
                submenu: [],
            },
        ]
    },
]    