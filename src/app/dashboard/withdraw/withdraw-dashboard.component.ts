import { Component, OnInit, TemplateRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
declare var $: any; // JQuery
@Component({
    templateUrl: './withdraw-dashboard.component.html'
})

export class WithdrawDashboardComponent implements OnInit {

    loading = false;
    pageSize = 10;
    dateFormat = 'dd/MM/yyyy';
    searchDate = [new Date(), new Date()];
    pageIndex = 1;
    total = 0;
    withdraws:any = [];
    selectedSubNumer: any = '';
    selectedStatus: any = '';
    searchAccountName: any = '';
    totalMoney: any = 0;
    amount: any = '';
    
    constructor(
        private paymentService: PaymentService,
    ) {
        //this.displayData = this.productsList
    }

    ngOnInit(): void {
        let users = JSON.parse(localStorage.getItem('user')) || [];
        //console.log(users, 'users');
        this.loadWithdrawList(this.pageIndex, this.pageSize, null, null, this.searchAccountName, this.selectedStatus, this.amount, this.searchDate[0], this.searchDate[1]);
    }

    onQueryParamsChange(params: NzTableQueryParams): void {
        const { pageSize, pageIndex, sort } = params;
        const currentSort = sort.find(item => item.value !== null);
        const sortField = (currentSort && currentSort.key) || null;
        const sortOrder = (currentSort && currentSort.value) || null;
        this.loadWithdrawList(pageIndex, pageSize, sortField, sortOrder, this.searchAccountName, this.selectedStatus, this.amount, this.searchDate[0], this.searchDate[1]);
    }
    
    loadWithdrawList(
        pageIndex: number,
        pageSize: number,
        sortField: string | null,
        sortOrder: string | null,
        filterAccountName: string | null,
        filterStatus: string | null,
        filterAmount: string | null,
        startDate: Date | null,
        endDate: Date | null,
    ): void {
        let page = 0;
        if(pageIndex !== 1) {
            page = pageSize * (pageIndex - 1);
        }
        this.loading = true;
        this.paymentService.getWithdraws(page, pageSize, sortField, sortOrder, filterAccountName, filterStatus, filterAmount, startDate, endDate)
        .subscribe((result:any) => {
            console.log(result, 'result');
            if(result.success) {
                this.loading = false;
                this.withdraws = result.data.data;
                this.total = result.data.total;
                this.pageSize = pageSize;
                this.pageIndex = pageIndex;
                this.searchAccountName = filterAccountName;
                this.totalMoney = result.data.totalMoney;
                this.selectedStatus = filterStatus;
                this.amount = filterAmount;
            }
        });
    }

    amountChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        this.pageSize = 10;
        this.pageIndex = 1;
        this.loadWithdrawList(this.pageIndex, this.pageSize, null, null, this.searchAccountName, this.selectedStatus, value, this.searchDate[0], this.searchDate[1]);
    }

    searchAccount(): void {
        this.pageIndex = 1;
        this.pageSize = 10;
        setTimeout( async () =>{
            this.loadWithdrawList(this.pageIndex, this.pageSize, null, null, this.searchAccountName, this.selectedStatus, this.amount, this.searchDate[0], this.searchDate[1]);
        }, 2000);
    }

    statusChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        this.pageIndex = 1;
        this.pageSize = 10;
        this.loadWithdrawList(this.pageIndex, this.pageSize, null, null, this.searchAccountName, value, this.amount, this.searchDate[0], this.searchDate[1]);
    }

    onChangeDateRange(result: Date[]): void {
        if(result.length === 0) {
            result = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()];
        }
        this.loadWithdrawList(this.pageIndex, this.pageSize, null, null, this.searchAccountName, this.selectedStatus, this.amount, result[0], result[1]);
    }
}