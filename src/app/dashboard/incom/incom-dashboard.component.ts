import { Component, OnInit, TemplateRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { IncomService } from 'src/app/shared/services/incom.service';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
declare var $: any; // JQuery
@Component({
    templateUrl: './incom-dashboard.component.html'
})

export class IncomDashboardComponent implements OnInit {
    themeColors = this.colorConfig.get().colors;
    blue = this.themeColors.blue;
    blueLight = this.themeColors.blueLight;
    cyan = this.themeColors.cyan;
    cyanLight = this.themeColors.cyanLight;
    gold = this.themeColors.gold;
    purple = this.themeColors.purple;
    purpleLight = this.themeColors.purpleLight;
    red = this.themeColors.red;
    revenueChartType = 'line';

    
    lineChartLegend = true;
    lineChartType = 'line';
    revenueChartFormat: string = 'revenueMonth';
    lineChartData: Array<any> = [
        { 
            data: [], 
            label: 'ZNS' 
        },
        {
            data: [], 
            label: 'SMS' 
        }
    ];

    lineChartLabels:Array<any> = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    lineChartOptions: any = {
        responsive: true,
        hover: {
            mode: 'nearest',
            intersect: true
        },
        tooltips: {
            mode: 'index'
        },
        scales: {
            xAxes: [{
                gridLines: [{
                    display: false,
                }],
                ticks: {
                    display: true,
                    fontColor: this.themeColors.grayLight,
                    fontSize: 13,
                    padding: 10
                }
            }],
            yAxes: [{
                gridLines: {
                    drawBorder: false,
                    drawTicks: false,
                    borderDash: [3, 4],
                    zeroLineWidth: 1,
                    zeroLineBorderDash: [3, 4]
                },
                ticks: {
                    display: true,
                    //max: 5000,
                    //stepSize: 500,
                    fontColor: this.themeColors.grayLight,
                    fontSize: 13,
                    padding: 10
                }
            }],
        }
    };

    lineChartColors: Array<any> = [
        {
            backgroundColor: this.themeColors.transparent,
            borderColor: this.themeColors.blue,
            pointBackgroundColor: this.themeColors.blue,
            pointBorderColor: this.themeColors.white,
            pointHoverBackgroundColor: this.themeColors.blueLight,
            pointHoverBorderColor: this.themeColors.blueLight
        },
        {
            backgroundColor: this.themeColors.transparent,
            borderColor: this.themeColors.cyan,
            pointBackgroundColor: this.themeColors.cyan,
            pointBorderColor: this.themeColors.white,
            pointHoverBackgroundColor: this.themeColors.cyanLight,
            pointHoverBorderColor: this.themeColors.cyanLight
        }
    ];

    allChecked:boolean = false;
    loading = false;
    pageSize = 10;
    dateFormat = 'dd/MM/yyyy';
    searchDate = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()];
    pageIndex = 1;
    total = null;
    indeterminate:boolean = false;
    messagesList:any = null;
    messages:any = null;
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
        private incomService: IncomService,
        private modalService: NzModalService,
        private notification: NzNotificationService,
        private colorConfig: ThemeConstantService
    ) {
        //this.displayData = this.productsList
    }

    ngOnInit(): void {
        
        let users = JSON.parse(localStorage.getItem('user')) || [];
        //console.log(users, 'users');
        this.loadMessageList(this.pageIndex, this.pageSize, null, null, '', '', this.searchDate[0], this.searchDate[1]);
    }

    onQueryParamsChange(params: NzTableQueryParams): void {
        const { pageSize, pageIndex, sort } = params;
        const currentSort = sort.find(item => item.value !== null);
        const sortField = (currentSort && currentSort.key) || null;
        const sortOrder = (currentSort && currentSort.value) || null;
        this.loadMessageList(pageIndex, pageSize, sortField, sortOrder, this.searchPhone, this.selectedStatus, this.searchDate[0], this.searchDate[1]);
    }
    
    loadMessageList(
        pageIndex: number,
        pageSize: number,
        sortField: string | null,
        sortOrder: string | null,
        filterPhone: string,
        filterStatus: string | null,
        startDate: Date | null,
        endDate: Date | null,
    ): void {
        let page = 0;
        if(pageIndex !== 1) {
            page = pageSize * (pageIndex - 1);
        }
        //this.loading = true;
        this.incomService.getMessages(page, pageSize, sortField, sortOrder, filterPhone, filterStatus, startDate, endDate)
        .subscribe(messages => {
            if(messages.success) {
                //this.loading = false;
                this.messages = messages.data.data;
                this.total = messages.data.total;
                this.pageSize = pageSize;
                this.pageIndex = pageIndex;
                this.searchPhone = filterPhone;
                this.selectedStatus = filterStatus;
            }
        });
    }

    searchPhoneNumber(): void {
        setTimeout( async () =>{
            this.loadMessageList(this.pageIndex, this.pageSize, null, null, this.searchPhone, this.selectedStatus, this.searchDate[0], this.searchDate[1]);
        }, 500);
    }

    statusChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        this.loadMessageList(this.pageIndex, this.pageSize, null, null, this.searchPhone, value, this.searchDate[0], this.searchDate[1]);
    }

    sendMessage(phoneNumber: string, contentMessage: string): void {
        this.loadingSendModal = true;
        this.incomService.sendMessage(phoneNumber, contentMessage)
        .subscribe(result => {
            // if(result.success) {
            this.notification.create(
                'success',
                'Notification',
                'Send message success'
            );
            this.loadMessageList(this.pageIndex, this.pageSize, null, null, '', '', this.searchDate[0], this.searchDate[1]);
            // } else {
            //     this.notification.create(
            //         'error',
            //         'Send message fail',
            //         `${result.code}`
            //     );
            // }
            this.modalService.closeAll();
            this.resetSendModal();
        });
    }

    resetSendModal(): void {
        this.loadingSendModal = false;
        this.phoneNumber = '';
        this.contentMessage = '';
        this.requiredForm = {
            phoneNumber: false,
            content: false
        };
    }

    showSendMessageModal(sendMessageContent: TemplateRef<{}>) {
        this.modalService.create({
            nzMaskClosable: false,
            nzTitle: 'Send New Message',
            nzOnCancel: () => {
                this.resetSendModal();
            },
            nzContent: sendMessageContent,
            nzFooter: [
                {
                    label: 'Send',
                    type: 'primary',
                    loading: () => this.loadingSendModal,
                    onClick: () => {
                        if(this.phoneNumber && this.contentMessage) {
                            this.requiredForm = false;
                            this.sendMessage(this.phoneNumber, this.contentMessage);
                        } else if (!this.contentMessage && !this.phoneNumber) {
                            this.requiredForm.content = true;
                            this.requiredForm.phoneNumber = true;
                        } else if(!this.phoneNumber) {
                            this.requiredForm.phoneNumber = true;
                            this.requiredForm.content = false;
                        } else if (!this.contentMessage) {
                            this.requiredForm.content = true;
                            this.requiredForm.phoneNumber = false;
                        }
                    },
                },
            ],
            nzWidth: 1000,
        })
    }

    dataChart = null;
    
    getStatistic(): void {
        // this.loadingSendModal = true;
        this.incomService.getStatistic()
        .subscribe(result => {
            if(result.success) {
                this.dataChart = result.data; 
                this.momentChange('revenueMonth');
            } else {
                this.notification.create(
                    'error',
                    'Get statistic fail',
                    `${result.code}`
                );
            }
            // this.modalService.closeAll();
            // this.resetSendModal();
        });
    }

    showStatisticModal(statisticContent: TemplateRef<{}>) {
        this.getStatistic();
        this.modalService.create({
            nzTitle: 'Statistic',
            nzContent: statisticContent,
            nzWidth: 800,
            nzFooter: null
        })
    }

    momentChange(value: string): void {
        console.log(value, 'value');
        console.log(this.dataChart, 'this.dataChart');
        if(value === 'revenueMonth') {
            this.lineChartData = [
                { 
                    data: this.dataChart.ZNS.monthZNS, 
                    label: 'ZNS' 
                },
                {
                    data: this.dataChart.SMS.monthSMS, 
                    label: 'SMS' 
                }
            ];
            this.lineChartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        } else if (value === 'revenueYear') {
            this.lineChartData = [
                { 
                    data: this.dataChart.ZNS.yearZNS, 
                    label: 'ZNS' 
                },
                {
                    data: this.dataChart.SMS.yearSMS, 
                    label: 'SMS' 
                }
            ];
            this.lineChartLabels = [new Date().getFullYear() - 2, new Date().getFullYear() - 1, new Date().getFullYear()];
        }
    }

    resetSendMultipleModal(): void {
        this.loadingSendMultipleModal = false;
        this.messagesList = [];
    }

    sendMultipleMessage(params): void {
        this.loadingSendMultipleModal = true;
        const list_params = {
            list_params: params
        };
        this.incomService.sendMultipleMessage(list_params)
        .subscribe(result => {
            if(result.successList.length > 0) {
                this.notification.create(
                    'success',
                    'Notification',
                    'Send message success'
                );
                this.loadMessageList(this.pageIndex, this.pageSize, null, null, '', '', this.searchDate[0], this.searchDate[1]);
            } else {
                this.notification.create(
                    'error',
                    'Send message fail',
                    `${result.errorList}`
                );
            }
            this.modalService.closeAll();
            this.resetSendMultipleModal();
        });
    }
    
    showSendMultipleMessageModal(sendMultipleMessageContent: TemplateRef<{}>) {
        this.modalService.create({
            nzMaskClosable: false,
            nzTitle: 'Send Multiple Message',
            nzOnCancel: () => {
            },
            nzContent: sendMultipleMessageContent,
            nzFooter: [
                {
                    label: 'Send',
                    type: 'primary',
                    loading: () => this.loadingSendMultipleModal,
                    onClick: () => {
                        if(this.messagesList.length > 0) {
                            this.sendMultipleMessage(this.messagesList);
                        } else {
                            this.notification.create(
                                'warning',
                                'Send message fail',
                                `No data to send`
                            );
                        }
                    },
                },
            ],
            nzWidth: 1500,
        })
    }
    
    
    // updateAllChecked(): void {
    //     this.indeterminate = false;
    //     if (this.allChecked) {
    //         this.messagesList.forEach(item => item.checked = true);
    //     } else {
    //         this.messagesList.forEach(item => item.checked = false);
    //     }
    // }

    // updateSingleChecked(): void {
    //     if (this.messagesList.every(item => item.checked === false)) {
    //         this.allChecked = false;
    //         this.indeterminate = false;
    //     } else if (this.messagesList.every(item => item.checked === true)) {
    //         this.allChecked = true;
    //         this.indeterminate = false;
    //     } else {
    //         this.indeterminate = true;
    //     }
    // }

    removeMessageList(item): void {
        this.messagesList.splice(item, 1);
        this.messagesList = [...this.messagesList];
    }

    uploadFile(info: NzUploadFile, sendMultipleMessageContent: TemplateRef<{}>): void {
        if(info.type === 'progress') {
            // this.Showprogressbar();
            $('div.ant-upload-list-item').css('display','none');
            //$(this).children('div.ant-upload-list-item').style.cssText += 'display: none;';
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = (<string>reader.result).split('\n');
                console.log(text, 'text');
                const arrText = [];
                for(const i of text) {
                    const textSplit = (<string>i).split('\t');
                    const content = textSplit[1].replace("\r", "");
                    arrText.push({
                        'phoneNumber': textSplit[0],
                        'content': content,
                    });
                }
                this.messagesList = arrText;
                this.showSendMultipleMessageModal(sendMultipleMessageContent);
            }
            reader.readAsText(info.file.originFileObj, "utf-8");
        }
    }

    onChangeDateRange(result: Date[]): void {
        if(result.length === 0) {
            result = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()];
        }
        this.loadMessageList(this.pageIndex, this.pageSize, null, null, this.searchPhone, this.selectedStatus, result[0], result[1]);
    }
        // progress = 0;
    // Showprogressbar()  
    // {  
    //     setInterval(() =>{
    //         this.progress += 1; 
    //             // if(this.progress = 100) {
    //             //     this.progress = 100
    //             // }
    //     } , 1000) 
    // }  

    
    
     
    //  if (this.progress == 0) {  
    //  } else {  
    //    this.progress = this.progress + 1;  
    //    if (this.progress = this.progress + 30) {  
    //      this.progress == this.progress + 1;  
    //      if (this.progress >= 100) {  
    //        this.progress = 100;  
    //      }  
    //    }  
     //}  
   
  
}