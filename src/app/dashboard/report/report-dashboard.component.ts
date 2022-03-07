import { Component, OnInit, TemplateRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { IncomService } from 'src/app/shared/services/incom.service';
import { ReportService } from 'src/app/shared/services/report.service';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
declare var $: any; // JQuery
@Component({
    templateUrl: './report-dashboard.component.html',
    styleUrls: ['./report-dashboard.component.css']
})

export class ReportDashboardComponent implements OnInit {
    themeColors = this.colorConfig.get().colors;
    blue = this.themeColors.blue;
    blueLight = this.themeColors.blueLight;
    cyan = this.themeColors.cyan;
    cyanLight = this.themeColors.cyanLight;
    gold = this.themeColors.gold;
    purple = this.themeColors.purple;
    purpleLight = this.themeColors.purpleLight;
    red = this.themeColors.red;

    allChecked:boolean = false;
    loadingQtyAccount = false;
    pageSize = 10;
    dateFormatQtyAcc = 'dd/MM/yyyy';
    dateRangeQtyAcc = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date(new Date().setDate(new Date().getDate() + 1))];
    searchDate = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()];
    pageIndex = 1;
    total = null;
    indeterminate:boolean = false;
    messagesList:any = null;
    messages:any = null;

    qtyAccountForeignOrg:number = null;
    qtyAccountForeignPer:number = null;
    qtyAccountVNOrg:number = null;
    qtyAccountVNPer:number = null;
    totalQtyAccount: number = null;

    selectedStatus: any = '';
    searchPhone: any = '';
    phoneNumber: any = '';
    contentMessage: any = '';
    loadingSendModal = false;
    loadingSendMultipleModal = false;
    requiredForm: any = {
        phoneNumber: false,
        content: false
    };
    
    constructor(
        private reportService: ReportService,
        private colorConfig: ThemeConstantService
    ) {
        //this.displayData = this.productsList
    }

    ngOnInit(): void {
        
        // let users = JSON.parse(localStorage.getItem('user')) || [];
        //console.log(users, 'users');
        this.loadQtyAccountList(this.dateRangeQtyAcc[0], this.dateRangeQtyAcc[1]);
    }

    onChangeDateRangeQtyAcc(result: Date[]): void {
        if(result.length === 0) {
            result = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()];
        }
        this.loadQtyAccountList(result[0], result[1]);
    }

    // onQueryParamsChange(params: NzTableQueryParams): void {
    //     const { pageSize, pageIndex, sort } = params;
    //     const currentSort = sort.find(item => item.value !== null);
    //     const sortField = (currentSort && currentSort.key) || null;
    //     const sortOrder = (currentSort && currentSort.value) || null;
    //     this.loadMessageList(pageIndex, pageSize, sortField, sortOrder, this.searchPhone, this.selectedStatus, this.searchDate[0], this.searchDate[1]);
    // }
    
    loadQtyAccountList(
        startDate: Date | null,
        endDate: Date | null,
    ): void {
        this.loadingQtyAccount = true;
        this.reportService.getCommission(startDate, endDate)
        .subscribe(result => {
            console.log(result, 'messages');
            if(result.success) {
                this.qtyAccountForeignOrg = result.data.rsQtyAccountForeignOrg;
                this.qtyAccountForeignPer = result.data.rsQtyAccountForeignPer;
                this.qtyAccountVNOrg = result.data.rsQtyAccountVNOrg;
                this.qtyAccountVNPer = result.data.rsQtyAccountVNPer;
                this.totalQtyAccount = this.qtyAccountForeignOrg + this.qtyAccountForeignPer + this.qtyAccountVNOrg + this.qtyAccountVNPer;
                this.loadingQtyAccount = false;
                // this.messages = messages.data.data;
                // this.total = messages.data.total;
                // this.pageSize = pageSize;
                // this.pageIndex = pageIndex;
                // this.searchPhone = filterPhone;
                // this.selectedStatus = filterStatus;
            }
        });
    }

    // searchPhoneNumber(): void {
    //     setTimeout( async () =>{
    //         this.loadMessageList(this.pageIndex, this.pageSize, null, null, this.searchPhone, this.selectedStatus, this.searchDate[0], this.searchDate[1]);
    //     }, 500);
    // }

    // statusChange(value: string): void {
    //     if(value === 'All') {
    //         value = '';
    //     }
    //     this.loadMessageList(this.pageIndex, this.pageSize, null, null, this.searchPhone, value, this.searchDate[0], this.searchDate[1]);
    // }
}