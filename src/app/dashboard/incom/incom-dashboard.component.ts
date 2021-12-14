import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { IncomService } from 'src/app/shared/services/incom.service';

@Component({
    templateUrl: './incom-dashboard.component.html'
})

export class IncomDashboardComponent implements OnInit {
    loading = true;
    pageSize = 10;
    pageIndex = 1;
    total = null;
    messages:any = null;
    selectedStatus: any = 1;
    searchPhone: any = '';

    constructor(
        private incomService: IncomService
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
        this.loading = true;
        this.incomService.getMessages(page, pageSize, sortField, sortOrder, filterPhone, filterStatus)
        .subscribe(messages => {
            if(messages.success) {
                this.loading = false;
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
}    