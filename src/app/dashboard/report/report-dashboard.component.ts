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
    loadingQtyAccountTrade = false;
    loadingCommission = false;
    loadingTradingListedSecurities = false;
    dateFormatQtyAcc = 'dd/MM/yyyy';
    dateFormatQtyAccTrade = 'dd/MM/yyyy';
    dateRangeQtyAcc = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date(new Date().setDate(new Date().getDate() + 1))];
    dateRangeQtyAccTrade = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date(new Date().setDate(new Date().getDate() + 1))];

    dateFormatCommission = 'MM/yyyy';
    dateMonthCommission = new Date(new Date().setMonth(new Date().getMonth() - 1));

    dateFormatTradingListedSecurities = 'MM/yyyy';
    dateMonthTradingListedSecurities = new Date(new Date().setMonth(new Date().getMonth() - 1));

    qtyAccountForeignOrgTrade:number = null;
    qtyAccountForeignPerTrade:number = null;
    qtyAccountVNOrgTrade:number = null;
    qtyAccountVNPerTrade:number = null;
    totalQtyAccountTrade: number = null;

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
    
    rsTradeBuyStockPersonalVNHNX:number = null;
    rsTradeBuyStockPersonalVNHSX:number = null;
    rsTradeBuyStockPersonalVNUPCOM:number = null;
    rsTradeSellStockPersonalVNHNX:number = null;
    rsTradeSellStockPersonalVNHSX:number = null;
    rsTradeSellStockPersonalVNUPCOM:number = null;
    rsTradeBuyStockPersonalForeignHNX:number = null;
    rsTradeBuyStockPersonalForeignHSX:number = null;
    rsTradeBuyStockPersonalForeignUPCOM:number = null;
    rsTradeSellStockPersonalForeignHNX:number = null;
    rsTradeSellStockPersonalForeignHSX:number = null;
    rsTradeSellStockPersonalForeignUPCOM:number = null;
    rsTradeBuyFundCertificatePersonalVNHNX:number = null;
    rsTradeBuyFundCertificatePersonalVNHSX:number = null;
    rsTradeBuyFundCertificatePersonalVNUPCOM:number = null;
    rsTradeSellFundCertificatePersonalVNHNX:number = null;
    rsTradeSellFundCertificatePersonalVNHSX:number = null;
    rsTradeSellFundCertificatePersonalVNUPCOM:number = null;
    rsTradeBuyFundCertificatePersonalForeignHNX:number = null;
    rsTradeBuyFundCertificatePersonalForeignHSX:number = null;
    rsTradeBuyFundCertificatePersonalForeignUPCOM:number = null;
    rsTradeSellFundCertificatePersonalForeignHNX:number = null;
    rsTradeSellFundCertificatePersonalForeignHSX:number = null;
    rsTradeSellFundCertificatePersonalForeignUPCOM:number = null;
    rsTradeBuyStockOrgHNX:number = null;
    rsTradeBuyStockOrgHSX:number = null;
    rsTradeBuyStockOrgUPCOM:number = null;
    rsTradeSellStockOrgHNX:number = null;
    rsTradeSellStockOrgHSX:number = null;
    rsTradeSellStockOrgUPCOM:number = null;
    rsTradeBuyBondOrgHNX:number = null;
    rsTradeBuyBondOrgHSX:number = null;
    rsTradeBuyBondOrgUPCOM:number = null;
    rsTradeSellBondOrgHNX:number = null;
    rsTradeSellBondOrgHSX:number = null;
    rsTradeSellBondOrgUPCOM:number = null;
    rsTradeBuyFundCertificateOrgHNX:number = null;
    rsTradeBuyFundCertificateOrgHSX:number = null;
    rsTradeBuyFundCertificateOrgUPCOM:number = null;
    rsTradeSellFundCertificateOrgHNX:number = null;
    rsTradeSellFundCertificateOrgHSX:number = null;
    rsTradeSellFundCertificateOrgUPCOM:number = null;

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
        const startOfMonthCommission = moment(this.dateMonthCommission).startOf('month').toISOString();
        const endOfMonthCommission   = moment(this.dateMonthCommission).endOf('month').toISOString();

        const startOfMonthTradingListedSecurities = moment(this.dateMonthCommission).startOf('month').toISOString();
        const endOfMonthTradingListedSecurities   = moment(this.dateMonthCommission).endOf('month').toISOString();
        // let users = JSON.parse(localStorage.getItem('user')) || [];
        // console.log(this.dateMonthCommission, 'users');
        // console.log(startOfMonth, 'startOfMonth');
        // console.log(endOfMonth, 'endOfMonth');
        this.loadQtyAccount(this.dateRangeQtyAcc[0], this.dateRangeQtyAcc[1]);
        this.loadQtyAccountTrade(this.dateRangeQtyAccTrade[0], this.dateRangeQtyAccTrade[1]);
        
        setTimeout(() => {
            this.loadCommission(startOfMonthCommission, endOfMonthCommission);
            this.loadTradingListedSecurities(startOfMonthTradingListedSecurities, endOfMonthTradingListedSecurities);
        }, 1200);
    }
    
    onChangeDateRangeQtyAccTrade(result: Date[]): void {
        if(result.length === 0) {
            result = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()];
        }
        this.loadQtyAccountTrade(result[0], result[1]);
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

    onChangeMonthRangeTradingListedSecurities(result: Date): void {
        const startOfMonth = moment(result).startOf('month').toISOString();
        const endOfMonth   = moment(result).endOf('month').toISOString();
        this.loadTradingListedSecurities(startOfMonth, endOfMonth);
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

    loadQtyAccountTrade(
        startDate: Date | null,
        endDate: Date | null,
    ): void {
        this.loadingQtyAccountTrade = true;
        this.reportService.getQtyAccountTrade(startDate, endDate)
        .subscribe(result => {
            console.log(result, 'messages');
            if(result.success) {
                this.qtyAccountForeignOrgTrade = result.data.rsQtyAccountForeignOrg;
                this.qtyAccountForeignPerTrade = result.data.rsQtyAccountForeignPer;
                this.qtyAccountVNOrgTrade = result.data.rsQtyAccountVNOrg;
                this.qtyAccountVNPerTrade = result.data.rsQtyAccountVNPer;
                this.totalQtyAccountTrade = this.qtyAccountForeignOrgTrade + this.qtyAccountForeignPerTrade + this.qtyAccountVNOrgTrade + this.qtyAccountVNPerTrade;
                this.loadingQtyAccountTrade = false;
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
                this.loadingCommission = false;
            }
        });
    }
    
    loadTradingListedSecurities(
        startDate: string | null,
        endDate: string | null,
    ): void {
        this.loadingTradingListedSecurities = true;
        this.reportService.getTradingListedSecurities(startDate, endDate)
        .subscribe(result => {
            console.log(result, 'messages');
            if(result.success) {
                this.rsTradeBuyStockPersonalVNHNX = result.data.rsTradeBuyStockPersonalVNHNX;
                this.rsTradeBuyStockPersonalVNHSX = result.data.rsTradeBuyStockPersonalVNHSX;
                this.rsTradeBuyStockPersonalVNUPCOM = result.data.rsTradeBuyStockPersonalVNUPCOM;
                this.rsTradeSellStockPersonalVNHNX = result.data.rsTradeSellStockPersonalVNHNX;
                this.rsTradeSellStockPersonalVNHSX = result.data.rsTradeSellStockPersonalVNHSX;
                this.rsTradeSellStockPersonalVNUPCOM = result.data.rsTradeSellStockPersonalVNUPCOM;
                this.rsTradeBuyStockPersonalForeignHNX = result.data.rsTradeBuyStockPersonalForeignHNX;
                this.rsTradeBuyStockPersonalForeignHSX = result.data.rsTradeBuyStockPersonalForeignHSX;
                this.rsTradeBuyStockPersonalForeignUPCOM = result.data.rsTradeBuyStockPersonalForeignUPCOM;
                this.rsTradeSellStockPersonalForeignHNX = result.data.rsTradeSellStockPersonalForeignHNX;
                this.rsTradeSellStockPersonalForeignHSX = result.data.rsTradeSellStockPersonalForeignHSX;
                this.rsTradeSellStockPersonalForeignUPCOM = result.data.rsTradeSellStockPersonalForeignUPCOM;
                this.rsTradeBuyFundCertificatePersonalVNHNX = result.data.rsTradeBuyFundCertificatePersonalVNHNX;
                this.rsTradeBuyFundCertificatePersonalVNHSX = result.data.rsTradeBuyFundCertificatePersonalVNHSX;
                this.rsTradeBuyFundCertificatePersonalVNUPCOM = result.data.rsTradeBuyFundCertificatePersonalVNUPCOM;
                this.rsTradeSellFundCertificatePersonalVNHNX = result.data.rsTradeSellFundCertificatePersonalVNHNX;
                this.rsTradeSellFundCertificatePersonalVNHSX = result.data.rsTradeSellFundCertificatePersonalVNHSX;
                this.rsTradeSellFundCertificatePersonalVNUPCOM = result.data.rsTradeSellFundCertificatePersonalVNUPCOM;
                this.rsTradeBuyFundCertificatePersonalForeignHNX = result.data.rsTradeBuyFundCertificatePersonalForeignHNX;
                this.rsTradeBuyFundCertificatePersonalForeignHSX = result.data.rsTradeBuyFundCertificatePersonalForeignHSX;
                this.rsTradeBuyFundCertificatePersonalForeignUPCOM = result.data.rsTradeBuyFundCertificatePersonalForeignUPCOM;
                this.rsTradeSellFundCertificatePersonalForeignHNX = result.data.rsTradeSellFundCertificatePersonalForeignHNX;
                this.rsTradeSellFundCertificatePersonalForeignHSX = result.data.rsTradeSellFundCertificatePersonalForeignHSX;
                this.rsTradeSellFundCertificatePersonalForeignUPCOM = result.data.rsTradeSellFundCertificatePersonalForeignUPCOM;
                this.rsTradeBuyStockOrgHNX = result.data.rsTradeBuyStockOrgHNX;
                this.rsTradeBuyStockOrgHSX = result.data.rsTradeBuyStockOrgHSX;
                this.rsTradeBuyStockOrgUPCOM = result.data.rsTradeBuyStockOrgUPCOM;
                this.rsTradeSellStockOrgHNX = result.data.rsTradeSellStockOrgHNX;
                this.rsTradeSellStockOrgHSX = result.data.rsTradeSellStockOrgHSX;
                this.rsTradeSellStockOrgUPCOM = result.data.rsTradeSellStockOrgUPCOM;
                this.rsTradeBuyBondOrgHNX = result.data.rsTradeBuyBondOrgHNX;
                this.rsTradeBuyBondOrgHSX = result.data.rsTradeBuyBondOrgHSX;
                this.rsTradeBuyBondOrgUPCOM = result.data.rsTradeBuyBondOrgUPCOM;
                this.rsTradeSellBondOrgHNX = result.data.rsTradeSellBondOrgHNX;
                this.rsTradeSellBondOrgHSX = result.data.rsTradeSellBondOrgHSX;
                this.rsTradeSellBondOrgUPCOM = result.data.rsTradeSellBondOrgUPCOM;
                this.rsTradeBuyFundCertificateOrgHNX = result.data.rsTradeBuyFundCertificateOrgHNX;
                this.rsTradeBuyFundCertificateOrgHSX = result.data.rsTradeBuyFundCertificateOrgHSX;
                this.rsTradeBuyFundCertificateOrgUPCOM = result.data.rsTradeBuyFundCertificateOrgUPCOM;
                this.rsTradeSellFundCertificateOrgHNX = result.data.rsTradeSellFundCertificateOrgHNX;
                this.rsTradeSellFundCertificateOrgHSX = result.data.rsTradeSellFundCertificateOrgHSX;
                this.rsTradeSellFundCertificateOrgUPCOM = result.data.rsTradeSellFundCertificateOrgUPCOM;
                this.loadingTradingListedSecurities = false;
            }
        });
    }

    previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1));
    disabledDateFormatCommission = (current: Date): boolean => differenceInCalendarDays(current, this.previousMonth) > 0;
    disabledDateFormattradingListedSecurities = (current: Date): boolean => differenceInCalendarDays(current, this.previousMonth) > 0;

}