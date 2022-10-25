import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import * as common from '../../shared/common/common';
import { ReportService } from 'src/app/shared/services/report.service';
import { UsersService } from 'src/app/shared/services/users.service';
declare var $: any; // JQuery
@Component({
    templateUrl: './sales.component.html'
})

export class SalesComponent implements OnInit {
    allChecked:boolean = false;
    loading = false;
    pageSize = 10;
    pageIndex = 1;
    dateFormat = 'dd/MM/yyyy';
    searchDate = [new Date(), new Date()];
    total = null;
    sales:any = null;
    selectedStatus: any = '';
    searchAccountNumber: any = '';
    users:any = null;
    searchUser: any = '';
    searchEmployee: any = '';
    searchRoom: any = '';
    searchBranch: any = '';
    totalTradeValue: any = '';

    filterBranchData: any = null;
    filterUserData: any = null;
    filterRoomData: any = null;
    
    constructor(
        private reportService: ReportService,
        private usersService: UsersService,
    ) {
        //this.displayData = this.productsList
    }

    ngOnInit(): void {
        let users = JSON.parse(localStorage.getItem('user')) || [];
        // console.log(users, 'users');
        const sEmployee = users.username;
        console.log(sEmployee, 'sEmployee');
        this.loadUsersList();
        setTimeout( async () => {
            const employees = this.users.map(item => {
                return item.username;
            });
            this.loadReportTradingList(this.pageIndex, this.pageSize, this.searchAccountNumber, this.searchBranch, employees.join(','), this.searchRoom, this.totalTradeValue, this.searchDate[0], this.searchDate[1]);
        }, 500);
    }

    accountNumberChange(): void {
        setTimeout( async () => {
            this.loadReportTradingList(this.pageIndex, this.pageSize, this.searchAccountNumber, this.searchBranch, this.searchEmployee, this.searchRoom, this.totalTradeValue, this.searchDate[0], this.searchDate[1]);
        }, 800);
    }

    onQueryParamsChange(params: NzTableQueryParams): void {
        const { pageSize, pageIndex } = params;
        // console.log(params, 'params');
        this.loadReportTradingList(pageIndex, pageSize, this.searchAccountNumber, this.searchBranch, this.searchEmployee, this.searchRoom, this.totalTradeValue, this.searchDate[0], this.searchDate[1]);
    }
    
    branchChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        this.pageSize = 10;
        this.pageIndex = 1;
        this.loadReportTradingList(this.pageIndex, this.pageSize, this.searchAccountNumber, value, this.searchEmployee, this.searchRoom, this.totalTradeValue, this.searchDate[0], this.searchDate[1]);
    }
    
    roomChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        this.pageSize = 10;
        this.pageIndex = 1;
        this.loadReportTradingList(this.pageIndex, this.pageSize, this.searchAccountNumber, this.searchBranch, this.searchEmployee, value, this.totalTradeValue, this.searchDate[0], this.searchDate[1]);
    }

    employeeChange(value: any): void {
        if(value === 'All' || value === null) {
            const employees = this.users.map(item => {
                return item.username;
            });
            value = employees.join(',')
        }
        this.pageSize = 10;
        this.pageIndex = 1;
        this.loadReportTradingList(this.pageIndex, this.pageSize, this.searchAccountNumber, this.searchBranch, value, this.searchRoom, this.totalTradeValue, this.searchDate[0], this.searchDate[1]);
    }

    totalTradeValueChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        this.pageSize = 10;
        this.pageIndex = 1;
        this.loadReportTradingList(this.pageIndex, this.pageSize, this.searchAccountNumber, this.searchBranch, this.searchEmployee, this.searchRoom, value, this.searchDate[0], this.searchDate[1]);
    }
      
    onChangeDateRange(result: Date[]): void {
        if(result.length === 0) {
            result = [new Date(), new Date()];
        }
        
        this.pageSize = 10;
        this.pageIndex = 1;
        this.loadReportTradingList(this.pageIndex, this.pageSize, this.searchAccountNumber, this.searchBranch, this.searchEmployee, this.searchRoom, this.totalTradeValue, result[0], result[1]);
    }

    loadReportTradingList(
        pageIndex: number,
        pageSize: number,
        accountNumber: number,
        branch: string,
        emp_no: string,
        room: string,
        totalTradeValue: string,
        startDate: Date | null,
        endDate: Date | null,
    ): void {
        let page = 0;
        if(pageIndex !== 1) {
            page = pageSize * (pageIndex - 1);
        }
        this.loading = true;
        const sDate = moment(new Date(startDate)).format('YYYYMMDD');
        const eDate = moment(new Date(endDate)).format('YYYYMMDD');
        this.reportService.getTradingReport(page, pageSize, accountNumber, branch, room, emp_no, totalTradeValue, sDate, eDate)
        .subscribe(result => {
            if(result.success) {
                this.loading = false;
                this.sales = result.data.data;
                console.log(this.sales, 'this.sales');
                this.total = result.data.total;
                this.pageSize = pageSize;
                this.pageIndex = pageIndex;

                this.searchAccountNumber = accountNumber;
                this.searchBranch = branch;
                this.searchEmployee = emp_no;
                this.searchRoom = room;
                this.totalTradeValue = totalTradeValue;
            }
        });
    }

    loadUsersList(): void {
        this.usersService.getUsers(1, 1000, '', '', '', '', '')
        .subscribe(users => {
            if(users.success) {
                this.users = users.data.data;
                this.filterBranchData = users.data.filterData.branch;
                this.filterRoomData = users.data.filterData.room;
                this.filterUserData = users.data.data
            }
        });
    }
    
    convertDDMM = (date) => {
        return `${date.substring(6, 8)}${date.substring(4, 6)}`;
    }

    parseInt = (num) => {
        return parseInt(num);
    }
}