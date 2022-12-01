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
    selectedStatus: any = '';
    searchAccountName: any = '';
    totalMoney: any = 0;
    sendItemDeposit: any = null;
    amount: any = '';
    loadingDepositModal = false;
    banks:any = [];
    
    constructor(
        private paymentService: PaymentService,
        private modalService: NzModalService,
    ) {
        //this.displayData = this.productsList
    }

    ngOnInit(): void {
        let users = JSON.parse(localStorage.getItem('user')) || [];
        //console.log(users, 'users');
        this.loadWithdrawList(this.pageIndex, this.pageSize, this.searchDate[0], this.searchDate[1]);
        this.loadBanks();
    }

    onQueryParamsChange(params: NzTableQueryParams): void {
        const { pageSize, pageIndex, sort } = params;
        const currentSort = sort.find(item => item.value !== null);
        const sortField = (currentSort && currentSort.key) || null;
        const sortOrder = (currentSort && currentSort.value) || null;
        this.loadWithdrawList(pageIndex, pageSize, this.searchDate[0], this.searchDate[1]);
    }
    
    loadWithdrawList(
        pageIndex: number,
        pageSize: number,
        startDate: Date | null,
        endDate: Date | null,
    ): void {
        let page = 0;
        if(pageIndex !== 1) {
            page = pageSize * (pageIndex - 1);
        }
        this.loading = true;
        this.paymentService.getSMSTpLink(page, pageSize, startDate, endDate)
        .subscribe((result:any) => {
            console.log(result, 'result');
            if(result.success) {
                this.loading = false;
                this.sms = result.data.data;
                this.total = result.data.total;
                this.pageSize = pageSize;
                this.pageIndex = pageIndex;
            }
        });
    }
    
    depositModal = (value, createActionContent) => {
        const arrSring = value.message.split(" ");
        const amount = parseInt(arrSring[3].slice(0, -3).substring(1).replaceAll(",", ""));
        // console.log(amount, 'amountStr');
        // const amount
        const accountBank = arrSring[2];
        const accountStock = arrSring[11].split(",")[1];
        let subNumber = '';
        let accountNumber = '';
        if(accountStock.length === 12) {
            subNumber = accountStock.slice(-2);
            accountNumber = accountStock.slice(0, -2);
        } else {
            accountNumber = accountStock;
            subNumber = '';
        }
        // const subNumber = arrSring[2];
        const params = {
            "accountNumber": accountNumber,
            "subNumber": subNumber,
            "accountBank": accountBank,
            "amount": amount,
            "content": value.message,
        }
        this.sendItemDeposit = cloneDeep(params);
        console.log(this.sendItemDeposit, 'this.sendItemDeposit');
        this.showDepositModal(params, createActionContent);
    }

    formatterNumber = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    showDepositModal(params, createActionContent: TemplateRef<{}>) {
        console.log(params, 'data');
        this.modalService.create({
            nzMaskClosable: false,
            nzTitle: 'Confirm',
            nzOnCancel: () => {
                this.resetTemplateModal();
            },
            nzContent: createActionContent,
            nzFooter: [
                {
                    label: 'Deposit',
                    type: 'primary',
                    loading: () => this.loadingDepositModal,
                    onClick: () => {
                        this.actionDeposit(params);
                    },
                },
            ],
            nzWidth: 1000,
        })
    }

    actionDeposit(params : Object): void {
        this.loadingDepositModal = true;
        const data = {
            
        };
        // this.incomService.createTemplate(params)
        // .subscribe(result => {
        //     // if(result.success) {
        //     this.notification.create(
        //         'success',
        //         'Notification',
        //         'Create template success'
        //     );
        //     this.loadTemplateList(this.pageIndex, this.pageSize);
        //     this.modalService.closeAll();
        //     this.resetTemplateModal();
        // });
    }

    resetTemplateModal(): void {
        this.loadingDepositModal = false;
        this.sendItemDeposit = {
            name: '',
            template: ''
        };
        // this.requiredForm = {
        //     phoneNumber: false,
        //     content: false
        // };
    }
    
    loadBanks(): void {
        this.paymentService.getBanks()
        .subscribe((result:any) => {
            
            // <img *ngIf="item.fromNm == 'Techcombank'" style="width: 100%;" src="assets/images/logo/TCB.png" />
            // <img *ngIf="item.fromNm == 'BIDV'" style="width: 100%;" src="assets/images/logo/BIDV.png" />
            // <img *ngIf="item.fromNm == 'VietinBank'" style="width: 100%;" src="assets/images/logo/ICB.png" />
            // <img *ngIf="item.fromNm == 'BanVietBank'" style="width: 100%;" src="assets/images/logo/VCCB.png" />
            // <img *ngIf="item.fromNm == 'Vietcombank'" style="width: 100%;" src="assets/images/logo/VCB.png" />
            // <img *ngIf="item.fromNm == 'ACB'" style="width: 100%;" src="assets/images/logo/ACB.png" />
            // <img *ngIf="item.fromNm == 'HDBank'" style="width: 100%;" src="assets/images/logo/HDB.png" />
            // <img *ngIf="item.fromNm == 'Sacombank'" style="width: 100%;" src="assets/images/logo/STB.png" />

            this.banks = result.data.filter((el) => { 
                return (
                    el.shortName === "Techcombank" || 
                    el.shortName === "BIDV" ||
                    el.shortName === "VietinBank" ||
                    el.shortName === "VietCapitalBank" ||
                    el.shortName === "Vietcombank" ||
                    el.shortName === "ACB" ||
                    el.shortName === "HDBank" ||
                    el.shortName === "Sacombank"
                ); 
            }); 
        });
    }
    // amountChange(value: string): void {
    //     if(value === 'All') {
    //         value = '';
    //     }
    //     this.pageSize = 10;
    //     this.pageIndex = 1;
    //     this.loadWithdrawList(this.pageIndex, this.pageSize, null, null, this.searchAccountName, this.selectedStatus, value, this.searchDate[0], this.searchDate[1]);
    // }

    // searchAccount(): void {
    //     this.pageIndex = 1;
    //     this.pageSize = 10;
    //     setTimeout( async () =>{
    //         this.loadWithdrawList(this.pageIndex, this.pageSize, null, null, this.searchAccountName, this.selectedStatus, this.amount, this.searchDate[0], this.searchDate[1]);
    //     }, 1000);
    // }

    // statusChange(value: string): void {
    //     if(value === 'All') {
    //         value = '';
    //     }
    //     this.pageIndex = 1;
    //     this.pageSize = 10;
    //     this.loadWithdrawList(this.pageIndex, this.pageSize, null, null, this.searchAccountName, value, this.amount, this.searchDate[0], this.searchDate[1]);
    // }

    // onChangeDateRange(result: Date[]): void {
    //     if(result.length === 0) {
    //         result = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()];
    //     }
    //     this.loadWithdrawList(this.pageIndex, this.pageSize, null, null, this.searchAccountName, this.selectedStatus, this.amount, result[0], result[1]);
    // }
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