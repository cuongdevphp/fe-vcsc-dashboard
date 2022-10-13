import { Component } from '@angular/core';
import { ROUTES } from './side-nav-routes.config';
import { ThemeConstantService } from '../../services/theme-constant.service';
import { cloneDeep } from "lodash";
@Component({
    selector: 'app-sidenav',
    templateUrl: './side-nav.component.html'
})

export class SideNavComponent{

    public menuItems: any[]
    isFolded : boolean;
    isSideNavDark : boolean;
    isExpand : boolean;

    constructor( private themeService: ThemeConstantService) {}

    ngOnInit(): void {
        let user = JSON.parse(localStorage.getItem('user')) || [];
        const routes = cloneDeep(ROUTES);
        // const routes = ROUTES;
        if(user.department !== 'IT') {
            routes.splice(0, 2);
        }
        // const menuUser = typeof user.menu !== 'undefined' ? JSON.parse(user.menu) : '';
        // if(menuUser) {
        //     for(const i of ROUTES) {
        //         let subMenu = [];
        //         for(const y in i.submenu) {
        //             if(menuUser.includes(i.submenu[y].name)) {
        //                 subMenu.push(i.submenu[y]);
        //             }
        //         }
        //         i.submenu = subMenu;
        //     }
        // }
        this.menuItems = routes.filter(menuItem => menuItem);
        this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
        this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);
        this.themeService.isSideNavDarkChanges.subscribe(isDark => this.isSideNavDark = isDark);
    }

    closeMobileMenu(): void {
        if (window.innerWidth < 992) {
            this.isFolded = false;
            this.isExpand = !this.isExpand;
            this.themeService.toggleExpand(this.isExpand);
            this.themeService.toggleFold(this.isFolded);
        }
    }
}
