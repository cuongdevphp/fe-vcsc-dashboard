import { Component, OnInit, TemplateRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { IncomService } from 'src/app/shared/services/incom.service';
import { ReportService } from 'src/app/shared/services/report.service';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
import { differenceInCalendarDays } from 'date-fns';

import * as moment from 'moment';
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
    loadingCommission = false;
    dateFormatQtyAcc = 'dd/MM/yyyy';
    dateRangeQtyAcc = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date(new Date().setDate(new Date().getDate() + 1))];

    dateFormatCommission = 'MM/yyyy';
    dateMonthCommission = new Date(new Date().setMonth(new Date().getMonth() - 1));


    qtyAccountForeignOrg:number = null;
    qtyAccountForeignPer:number = null;
    qtyAccountVNOrg:number = null;
    qtyAccountVNPer:number = null;
    totalQtyAccount: number = null;

    
    rsQtyTotalBuyStockVN:number = null;
    rsQtyTotalSellStockVN:number = null;
    rsTotalValueBuyStockVN:number = null;
    rsTotalValueSellStockVN:number = null;
    rsTotalQtyBuyStockForeign:number = null;
    rsTotalQtySellStockForeign:number = null;
    rsTotalValueBuyStockForeign:number = null;
    rsTotalValueSellStockForeign:number = null;
    rsTotalQtyBuyBondVN:number = null;
    rsTotalQtySellBondVN:number = null;
    rsTotalValueBuyBondVN:number = null;
    rsTotalValueSellBondVN:number = null;
    rsTotalQtyBuyBondForeign:number = null;
    rsTotalQtySellBondForeign:number = null;
    rsTotalValueBuyBondForeign:number = null;
    rsTotalValueSellBondForeign:number = null;
    rsTotalQtyBuyFundVN:number = null;
    rsTotalQtySellFundVN:number = null;
    rsTotalValueBuyFundVN:number = null;
    rsTotalValueSellFundVN:number = null;
    rsTotalQtyBuyFundForeign:number = null;
    rsTotalQtySellFundForeign:number = null;
    rsTotalValueBuyFundForeign:number = null;
    rsTotalValueSellFundForeign:number = null;

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

        const startOfMonth = moment(this.dateMonthCommission).startOf('month').toISOString();
        const endOfMonth   = moment(this.dateMonthCommission).endOf('month').toISOString();

        // let users = JSON.parse(localStorage.getItem('user')) || [];
        console.log(this.dateMonthCommission, 'users');
        console.log(startOfMonth, 'startOfMonth');
        console.log(endOfMonth, 'endOfMonth');
        this.loadQtyAccount(this.dateRangeQtyAcc[0], this.dateRangeQtyAcc[1]);
        
        setTimeout(() => {
            this.loadCommission(startOfMonth, endOfMonth);
        }, 1200);
    }

    onChangeDateRangeQtyAcc(result: Date[]): void {
        if(result.length === 0) {
            result = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()];
        }
        this.loadQtyAccount(result[0], result[1]);
    }

    onChangeMonthRangeCommission(result: Date): void {
        const startOfMonth = moment(result).startOf('month').toISOString();
        const endOfMonth   = moment(result).endOf('month').toISOString();
        this.loadCommission(startOfMonth, endOfMonth);
    }
    
    loadQtyAccount(
        startDate: Date | null,
        endDate: Date | null,
    ): void {
        this.loadingQtyAccount = true;
        this.reportService.getQtyAccount(startDate, endDate)
        .subscribe(result => {
            console.log(result, 'messages');
            if(result.success) {
                this.qtyAccountForeignOrg = result.data.rsQtyAccountForeignOrg;
                this.qtyAccountForeignPer = result.data.rsQtyAccountForeignPer;
                this.qtyAccountVNOrg = result.data.rsQtyAccountVNOrg;
                this.qtyAccountVNPer = result.data.rsQtyAccountVNPer;
                this.totalQtyAccount = this.qtyAccountForeignOrg + this.qtyAccountForeignPer + this.qtyAccountVNOrg + this.qtyAccountVNPer;
                this.loadingQtyAccount = false;
            }
        });
    }

    loadCommission(
        startDate: string | null,
        endDate: string | null,
    ): void {
        this.loadingCommission = true;
        this.reportService.getCommission(startDate, endDate)
        .subscribe(result => {
            console.log(result, 'messages');
            if(result.success) {
                this.rsQtyTotalBuyStockVN = result.data.rsQtyTotalBuyStockVN;
                this.rsQtyTotalSellStockVN = result.data.rsQtyTotalSellStockVN;
                this.rsTotalValueBuyStockVN = result.data.rsTotalValueBuyStockVN;
                this.rsTotalValueSellStockVN = result.data.rsTotalValueSellStockVN;
                this.rsTotalQtyBuyStockForeign = result.data.rsTotalQtyBuyStockForeign;
                this.rsTotalQtySellStockForeign = result.data.rsTotalQtySellStockForeign;
                this.rsTotalValueBuyStockForeign = result.data.rsTotalValueBuyStockForeign;
                this.rsTotalValueSellStockForeign = result.data.rsTotalValueSellStockForeign;
                this.rsTotalQtyBuyBondVN = result.data.rsTotalQtyBuyBondVN;
                this.rsTotalQtySellBondVN = result.data.rsTotalQtySellBondVN;
                this.rsTotalValueBuyBondVN = result.data.rsTotalValueBuyBondVN;
                this.rsTotalValueSellBondVN = result.data.rsTotalValueSellBondVN;
                this.rsTotalQtyBuyBondForeign = result.data.rsTotalQtyBuyBondForeign;
                this.rsTotalQtySellBondForeign = result.data.rsTotalQtySellBondForeign;
                this.rsTotalValueBuyBondForeign = result.data.rsTotalValueBuyBondForeign;
                this.rsTotalValueSellBondForeign = result.data.rsTotalValueSellBondForeign;
                this.rsTotalQtyBuyFundVN = result.data.rsTotalQtyBuyFundVN;
                this.rsTotalQtySellFundVN = result.data.rsTotalQtySellFundVN;
                this.rsTotalValueBuyFundVN = result.data.rsTotalValueBuyFundVN;
                this.rsTotalValueSellFundVN = result.data.rsTotalValueSellFundVN;
                this.rsTotalQtyBuyFundForeign = result.data.rsTotalQtyBuyFundForeign;
                this.rsTotalQtySellFundForeign = result.data.rsTotalQtySellFundForeign;
                this.rsTotalValueBuyFundForeign = result.data.rsTotalValueBuyFundForeign;
                this.rsTotalValueSellFundForeign = result.data.rsTotalValueSellFundForeign;
                // this.totalQtyAccount = this.qtyAccountForeignOrg + this.qtyAccountForeignPer + this.qtyAccountVNOrg + this.qtyAccountVNPer;
                this.loadingCommission = false;
            }
        });
    }
    
    previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1));
    disabledDateFormatCommission = (current: Date): boolean => differenceInCalendarDays(current, this.previousMonth) > 0;

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