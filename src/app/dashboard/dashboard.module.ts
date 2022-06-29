import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { NgChartjsModule } from 'ng-chartjs';

import { ThemeConstantService } from '../shared/services/theme-constant.service';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { DefaultDashboardComponent } from './default/default-dashboard.component';
import { IncomDashboardComponent } from './incom/incom-dashboard.component';
import { PaymentDashboardComponent } from './payment/payment-dashboard.component';
import { TableService } from '../shared/services/table.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { UsersDashboardComponent } from './users/users.component';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { ReactiveFormsModule } from '@angular/forms';
import { StatisticsDashboardComponent } from './statistics/statistics-dashboard.component';
import { ChatComponent } from './chat/chat.component';
import { ReportDashboardComponent } from './report/report-dashboard.component';
import { TradingDashboardComponent } from './trading/trading.component';

const antdModule = [
    NzPopconfirmModule,
    NzButtonModule,
    NzCardModule,
    NzSwitchModule,
    NzAvatarModule,
    NzRateModule,
    NzBadgeModule,
    NzProgressModule,
    NzRadioModule,
    NzTableModule,
    NzDropDownModule,
    NzTimelineModule,
    NzTabsModule,
    NzTagModule,
    NzListModule,
    NzCalendarModule,
    NzToolTipModule,
    NzCheckboxModule,
    NzSelectModule,
    NzFormModule,
    NzModalModule,
    NzUploadModule,
    NzInputModule,
    NzPaginationModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzMessageModule,
    NzSpinModule,
]

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DashboardRoutingModule,
        ReactiveFormsModule,
        NgChartjsModule,
        ...antdModule
    ],
    exports: [],
    declarations: [
        DefaultDashboardComponent,
        IncomDashboardComponent,
        UsersDashboardComponent,
        StatisticsDashboardComponent,
        ReportDashboardComponent,
        TradingDashboardComponent,
        PaymentDashboardComponent,
        ChatComponent
    ],
    providers: [
        ThemeConstantService,
        TableService
    ],
})
export class DashboardModule { }
