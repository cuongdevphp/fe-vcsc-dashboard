import { Component, OnInit, TemplateRef } from '@angular/core';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { IncomService } from 'src/app/shared/services/incom.service';
import { cloneDeep } from "lodash";
import * as common from '../../shared/common/common';
declare var $: any; // JQuery
@Component({
    templateUrl: './follower.component.html'
})

export class FollowerComponent implements OnInit {
    allChecked:boolean = false;
    loading = false;
    pageSize = 10;
    dateFormat = 'dd/MM/yyyy';
    searchDate = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()];
    pageIndex = 1;
    total = null;
    indeterminate:boolean = false;
    templates:any = null;
    selectedStatus: any = '';
    searchPhone: any = '';
    phoneNumber: any = '';
    editTemplate: any = null;
    contentMessage: any = '';
    loadingTemplateModal = false;
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
        let users = JSON.parse(localStorage.getItem('user')) || [];
        //console.log(users, 'users');
        this.loadTemplateList(this.pageIndex, this.pageSize);
    }

    onQueryParamsChange(params: NzTableQueryParams): void {
        const { pageSize, pageIndex } = params;
        this.loadTemplateList(pageIndex, pageSize);
    }
    
    loadTemplateList(
        pageIndex: number,
        pageSize: number,
    ): void {
        let page = 0;
        if(pageIndex !== 1) {
            page = pageSize * (pageIndex - 1);
        }
        //this.loading = true;
        this.incomService.getTemplates(page, pageSize)
        .subscribe(templates => {
            if(templates.success) {
                //this.loading = false;
                this.templates = templates.data.data;
                this.total = templates.data.total;
                this.pageSize = pageSize;
                this.pageIndex = pageIndex;
            }
        });
    }

    editTemplateModal = (value, createTemplateContent) => {
        console.log(value, 'fsdf');
        this.editTemplate = cloneDeep(value);
        this.showTemplateModal(value, createTemplateContent);
    }

    convertDDMMYYYYHHMM = (date) => {
        return moment(new Date(date)).format('DD/MM/YYYY HH:mm');
    }

    createTemplate(name: string, template: string): void {
        this.loadingTemplateModal = true;
        const data = {
            name,
            template
        }
        this.incomService.createTemplate(data).subscribe(result => {
            // if(result.success) {
            this.notification.create(
                'success',
                'Notification',
                'Send message success'
            );
            this.loadTemplateList(this.pageIndex, this.pageSize);
            // } else {
            //     this.notification.create(
            //         'error',
            //         'Send message fail',
            //         `${result.code}`
            //     );
            // }
            this.modalService.closeAll();
            this.resetTemplateModal();
        });
    }

    resetTemplateModal(): void {
        this.loadingTemplateModal = false;
        this.editTemplate = {
            name: '',
            template: ''
        };
        // this.requiredForm = {
        //     phoneNumber: false,
        //     content: false
        // };
    }

    createTemplateModal = (value, createTemplateContent) => {
        console.log(value, 'fsdf');
        this.editTemplate = {
            name: '',
            template: ''
        };
        this.showTemplateModal(this.editTemplate, createTemplateContent);
    }

    create(name: string, template: string): void {
        this.loadingTemplateModal = true;
        const data = {
            name, template
        };
        this.incomService.createTemplate(data)
        .subscribe(result => {
            // if(result.success) {
            this.notification.create(
                'success',
                'Notification',
                'Create template success'
            );
            this.loadTemplateList(this.pageIndex, this.pageSize);
            this.modalService.closeAll();
            this.resetTemplateModal();
        });
    }

    edit(id: number, name: string, template: string): void {
        this.loadingTemplateModal = true;
        const data = {
            name, template, id
        };
        this.incomService.editTemplate(id, data)
        .subscribe(result => {
            // if(result.success) {
            this.notification.create(
                'success',
                'Notification',
                'Edit template success'
            );
            this.loadTemplateList(this.pageIndex, this.pageSize);
            this.modalService.closeAll();
            this.resetTemplateModal();
        });
    }

    showTemplateModal(data, createTemplateContent: TemplateRef<{}>) {
        this.modalService.create({
            nzMaskClosable: false,
            nzTitle: data ? 'Edit Template' : 'Create Template',
            nzOnCancel: () => {
                this.resetTemplateModal();
            },
            nzContent: createTemplateContent,
            nzFooter: [
                {
                    label: data ? 'Edit' : 'Create',
                    type: 'primary',
                    loading: () => this.loadingTemplateModal,
                    onClick: () => {
                        if(typeof this.editTemplate.id !== 'undefined') {
                            this.edit(this.editTemplate.id, this.editTemplate.name, this.editTemplate.template);
                        } else {
                            this.create(data.name, data.template);
                        }
                    },
                },
            ],
            nzWidth: 1000,
        })
    }
}