import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { cloneDeep } from "lodash";
import { filter } from 'rxjs/internal/operators/filter';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
declare var $: any; // JQuery
@Component({
    templateUrl: './sms-dashboard.component.html'
})

export class SmsDashboardComponent implements OnInit {

    loading = false;
    pageSize = 10;
    dateFormat = 'dd/MM/yyyy';
    searchDate = [new Date(), new Date()];
    pageIndex = 1;
    total = 0;
    lastIdx: any = '';
    sms:any = [];
    selectedSubNumer: any = '';
    selectedType: any = '1';
    selectedStatus: any = '';
    searchAccountName: any = '';
    totalMoney: any = 0;
    sendItemDeposit: any = null;
    amount: any = '';
    loadingDepositModal = false;
    banks:any = [];
    bankCode:any = 'Vietcombank';
    requiredForm: any = {
        accountNumber: false,
        subNumber: false,
        accountBank: false,
        amount: false,
        content: false,
    };
    constructor(
        private notification: NzNotificationService,
        private paymentService: PaymentService,
        private modalService: NzModalService,
    ) {
        //this.displayData = this.productsList
    }

    ngOnInit(): void {
        let users = JSON.parse(localStorage.getItem('user')) || [];
        //console.log(users, 'users');
        this.loadWithdrawList(this.pageIndex, this.pageSize, this.bankCode, this.selectedType, this.selectedStatus, this.searchDate[0], this.searchDate[1]);
        this.loadBanks();
    }

    onQueryParamsChange(params: NzTableQueryParams): void {
        const { pageSize, pageIndex, sort } = params;
        const currentSort = sort.find(item => item.value !== null);
        const sortField = (currentSort && currentSort.key) || null;
        const sortOrder = (currentSort && currentSort.value) || null;
        this.loadWithdrawList(pageIndex, pageSize, this.bankCode, this.selectedType, this.selectedStatus, this.searchDate[0], this.searchDate[1]);
    }
    
    loadWithdrawList(
        pageIndex: number,
        pageSize: number,
        bankCode: string,
        type: string,
        status: string,
        startDate: Date | null,
        endDate: Date | null,
    ): void {
        let page = 0;
        if(pageIndex !== 1) {
            page = pageSize * (pageIndex - 1);
        }
        this.loading = true;
        this.paymentService.getSMSTpLink(page, pageSize, bankCode, type, status, startDate, endDate)
        .subscribe((result:any) => {
            console.log(result, 'result');
            if(result.success) {
                this.loading = false;
                this.sms = result.data.data;
                this.total = result.data.total;
                this.pageSize = pageSize;
                this.pageIndex = pageIndex;
                this.bankCode = bankCode;
                this.selectedType = type;
                this.selectedStatus = status;
            }
        });
    }
    
    depositModal = (value, createActionContent) => {
        console.log(value, 'value');
        const params = {
            "idx": value.idx,
            "accountNumber": value.accountNumber.toUpperCase(),
            "subNumber": '',
            "accountBank": value.accountBank,
            "amount": value.amount,
            "content": value.message,
        }
        this.sendItemDeposit = cloneDeep(params);
        this.showDepositModal(params, createActionContent);
    }

    withdrawModal = (createActionContentWithdraw) => {
        this.showWithdrawModal(createActionContentWithdraw);
    }

    showWithdrawModal(createActionContentWithdraw: TemplateRef<{}>) {
        this.modalService.create({
            nzMaskClosable: false,
            nzTitle: 'Confirm',
            nzOnCancel: () => {
                // this.resetDepositModal();
            },
            nzContent: createActionContentWithdraw,
            nzFooter: [
                {
                    label: 'OK',
                    type: 'primary',
                    loading: () => false,
                    onClick: () => {
                    },
                },
            ],
            nzWidth: 500,
        })
    }
    
    showDepositModal(params, createActionContent: TemplateRef<{}>) {
        this.modalService.create({
            nzMaskClosable: false,
            nzTitle: 'Confirm',
            nzOnCancel: () => {
                this.resetDepositModal();
            },
            nzContent: createActionContent,
            nzFooter: [
                {
                    label: 'Deposit',
                    type: 'primary',
                    loading: () => this.loadingDepositModal,
                    onClick: () => {
                        if(
                            this.sendItemDeposit.accountNumber && 
                            this.sendItemDeposit.subNumber && 
                            this.sendItemDeposit.accountBank && 
                            this.sendItemDeposit.amount && 
                            this.sendItemDeposit.content
                        ) {
                            this.requiredForm = false;
                            console.log(this.sendItemDeposit, "dsada");
                            this.actionDeposit(this.sendItemDeposit);
                        } 
                        else if (!this.sendItemDeposit.accountNumber) {
                            this.requiredForm.accountNumber = true; 
                        } 
                        else if (!this.sendItemDeposit.subNumber) {
                            this.requiredForm.subNumber = true;
                        }
                        else if (!this.sendItemDeposit.accountBank) {
                            this.requiredForm.accountBank = true;
                        }
                        else if (!this.sendItemDeposit.amount) {
                            this.requiredForm.amount = true;
                        }
                        else if (!this.sendItemDeposit.content) {
                            this.requiredForm.content = true;
                        }
                    },
                },
            ],
            nzWidth: 1000,
        })
    }

    actionDeposit(params : Object): void {
        this.loadingDepositModal = true;
        console.log(params, 'params');
        this.paymentService.actionSIM(params)
        .subscribe(result => {
            this.notification.create(
                'success',
                'Notification',
                result.message
            );
            this.loadWithdrawList(this.pageIndex, this.pageSize, this.bankCode, this.selectedType, this.selectedStatus, this.searchDate[0], this.searchDate[1]);
            this.modalService.closeAll();
            this.resetDepositModal();
        });
    }

    resetDepositModal(): void {
        this.loadingDepositModal = false;
        this.sendItemDeposit = {
            accountNumber: '',
            subNumber: '',
            accountBank: '',
            amount: '',
            content: ''
        };
        this.requiredForm = {
            accountNumber: false,
            subNumber: false,
            accountBank: false,
            amount: false,
            content: false,
        };
    }
    
    formatterNumber = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    loadBanks(): void {
        this.paymentService.getBanks()
        .subscribe((result:any) => {
            this.banks = result.data.filter((el) => { 
                return (
                    el.shortName === "Techcombank" || // 
                    el.shortName === "BIDV" || // 
                    el.shortName === "VietinBank" || // 
                    el.shortName === "VietCapitalBank" ||
                    el.shortName === "Vietcombank" || //
                    el.shortName === "ACB" || // 
                    el.shortName === "HDBank" || //
                    el.shortName === "Sacombank" || //
                    el.shortName === "VIB" || //
                    el.shortName === "Eximbank" //
                ); 
            }); 
        });
    }
    
    bankCodeChange(value: string): void {
        console.log(value, 'value');
        if(value === 'All') {
            value = '';
        }
        this.pageIndex = 1;
        this.pageSize = 10;
        this.loadWithdrawList(this.pageIndex, this.pageSize, value, this.selectedType, this.selectedStatus, this.searchDate[0], this.searchDate[1]);
    }

    statusChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        this.pageSize = 10;
        this.pageIndex = 1;
        this.loadWithdrawList(this.pageIndex, this.pageSize, this.bankCode, this.selectedType, value, this.searchDate[0], this.searchDate[1]);
    }

    // searchAccount(): void {
    //     this.pageIndex = 1;
    //     this.pageSize = 10;
    //     setTimeout( async () =>{
    //         this.loadWithdrawList(this.pageIndex, this.pageSize, null, null, this.searchAccountName, this.selectedStatus, this.amount, this.searchDate[0], this.searchDate[1]);
    //     }, 1000);
    // }

    typeChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        this.pageIndex = 1;
        this.pageSize = 10;
        this.loadWithdrawList(this.pageIndex, this.pageSize, this.bankCode, value, this.selectedStatus, this.searchDate[0], this.searchDate[1]);
    }

    onChangeDateRange(result: Date[]): void {
        if(result.length === 0) {
            result = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()];
        }
        this.pageIndex = 1;
        this.pageSize = 10;
        this.loadWithdrawList(this.pageIndex, this.pageSize, this.bankCode, this.selectedType, this.selectedStatus, result[0], result[1]);
    }
}


// var a=
// {URL:
// {
// authCgi:"cgi-bin/auth_cgi",
// webCgi:"cgi-bin/web_cgi"},
// INTERVALS:{
//     heartbeatInterval:1e4,wifiRebootInterval:10,reboot:30,powerOff:10,restoreConf:35},MODULES:


//     login:function(a,e){
//         if(a){
//             var f=CryptoJS.MD5([a,b.get("nonce")].join(":")).toString();
//             switch(b.login({digest:f}),b.get("loginResult")){
//                 case c.success:d.setToken(b.get("token")),``
//                 e(c.success);break;case c.pwdWrong:e(c.pwdWrong);break;default:e()}}},
//                 logout:function(a){b.logout(),d.removeToken(),"function"==typeof a&&a()},isCookieEnable:function(){return a.cookie("check_cookie","check_cookie",{path:"/"}),"check_cookie"===a.cookie("check_cookie")}};window.AuthModel=d}(jQuery),function(){"function"!=typeof Array.prototype.indexOf&&(Array.prototype.indexOf=function(a){for(var b=this.length-1;b>=0;b--)if(this[b]===a)return b;return-1})}()