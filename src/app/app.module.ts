import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

import { registerLocaleData, PathLocationStrategy, LocationStrategy } from '@angular/common';
import en from '@angular/common/locales/en';

import { AppRoutingModule } from './app-routing.module';
import { TemplateModule } from './shared/template/template.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { CommonLayoutComponent } from './layouts/common-layout/common-layout.component';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';

import { NgChartjsModule } from 'ng-chartjs';
import { ThemeConstantService } from './shared/services/theme-constant.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor, JwtInterceptor } from './shared/_helpers';
import { NotFoundComponent } from './not-found/not-found.component';

registerLocaleData(en);

@NgModule({
    declarations: [
        AppComponent,
        CommonLayoutComponent,
        FullLayoutComponent,
        NotFoundComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        NzBreadCrumbModule,
        TemplateModule,
        SharedModule,
        NgChartjsModule
    ],
    providers: [
        { 
            provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true 
        },
        { 
            provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true 
        },
        
        // provider used to create fake backend
        // fakeBackendProvider,
        {
            provide: NZ_I18N,
            useValue: en_US, 
        },
        {
            provide: LocationStrategy, 
            useClass: PathLocationStrategy
        },
        ThemeConstantService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }


