import { Component, OnInit, TemplateRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { IncomService } from 'src/app/shared/services/incom.service';

@Component({
    templateUrl: './incom-dashboard.component.html'
})

export class IncomDashboardComponent implements OnInit {
    loading = false;
    pageSize = 10;
    pageIndex = 1;
    total = null;
    messages:any = null;
    selectedStatus: any = '';
    searchPhone: any = '';
    phoneNumber: any = '';
    contentMessage: any = '';
    loadingSendModal = false;
    requiredForm: any = {
        phoneNumber: false,
        content: false
    };

    constructor(
        private incomService: IncomService,
        private modalService: NzModalService,
        private notification: NzNotificationService,
    ) {
        //this.displayData = this.productsList
    }

    ngOnInit(): void {
        this.loadMessageList(this.pageIndex, this.pageSize, null, null, '', '');
    }

    onQueryParamsChange(params: NzTableQueryParams): void {
        const { pageSize, pageIndex, sort } = params;
        const currentSort = sort.find(item => item.value !== null);
        const sortField = (currentSort && currentSort.key) || null;
        const sortOrder = (currentSort && currentSort.value) || null;
        this.loadMessageList(pageIndex, pageSize, sortField, sortOrder, this.searchPhone, this.selectedStatus);
    }
    
    loadMessageList(
        pageIndex: number,
        pageSize: number,
        sortField: string | null,
        sortOrder: string | null,
        filterPhone: string,
        filterStatus: string | null,
    ): void {
        let page = 0;
        if(pageIndex !== 1) {
            page = pageSize * (pageIndex - 1);
        }
        //this.loading = true;
        this.incomService.getMessages(page, pageSize, sortField, sortOrder, filterPhone, filterStatus)
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
            this.loadMessageList(this.pageIndex, this.pageSize, null, null, this.searchPhone, this.selectedStatus);
        }, 500);
    }

    statusChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        this.loadMessageList(this.pageIndex, this.pageSize, null, null, this.searchPhone, value);
    }

    sendMessage(phoneNumber: string, contentMessage: string): void {
        this.loadingSendModal = true;
        this.incomService.sendMessage(phoneNumber, contentMessage)
        .subscribe(result => {
            if(result.success) {
                this.notification.create(
                    'success',
                    'Notification',
                    'Send message success'
                );
                this.loadMessageList(this.pageIndex, this.pageSize, null, null, '', '');
            } else {
                this.notification.create(
                    'error',
                    'Send message fail',
                    `${result.code}`
                );
            }
            this.modalService.closeAll();
            this.resetInput();
            this.loadingSendModal = false;
        });
    }

    resetInput(): void {
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
            nzTitle: 'Create New Message',
            nzOnCancel: () => {
                this.resetInput();
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
            nzWidth: 800,
        })    
    }
}    