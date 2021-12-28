import { Component, OnInit, TemplateRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UsersService } from 'src/app/shared/services/users.service';
declare var $: any; // JQuery
@Component({
    templateUrl: './users.component.html'
})

export class UsersDashboardComponent implements OnInit {
    filterTeamData: any = null;
    filterBranchData: any = null;
    filterRoomData: any = null;
    searchUser: any = '';
    selectedTeam: any = '';
    selectedBranch: any = '';
    selectedRoom: any = '';
    users:any = null;

    allChecked:boolean = false;
    loading = false;
    pageSize = 10;
    dateFormat = 'dd/MM/yyyy';
    searchDate = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()];
    pageIndex = 1;
    total = null;
    indeterminate:boolean = false;
    messagesList:any = null;
    phoneNumber: any = '';
    contentMessage: any = '';
    loadingSendModal = false;
    loadingSendMultipleModal = false;
    requiredForm: any = {
        phoneNumber: false,
        content: false
    };
    
    constructor(
        private usersService: UsersService,
        private modalService: NzModalService,
        private notification: NzNotificationService,
    ) {

    }

    ngOnInit(): void {
        //let users = JSON.parse(localStorage.getItem('user')) || [];
        this.loadUsersList(this.pageIndex, this.pageSize, this.searchUser, this.selectedTeam, this.selectedBranch, this.selectedRoom);
    }

    onQueryParamsChange(params: NzTableQueryParams): void {
        const { pageSize, pageIndex, sort } = params;
        this.loadUsersList(pageIndex, pageSize, this.searchUser, this.selectedTeam, this.selectedBranch, this.selectedRoom);
    }
    
    loadUsersList(
        pageIndex: number,
        pageSize: number,
        searchUserName: string,
        searchTeam: string,
        searchBranch: string,
        searchRoom: string,
    ): void {
        let page = 0;
        if(pageIndex !== 1) {
            page = pageSize * (pageIndex - 1);
        }
        //this.loading = true;
        console.log(searchUserName, 'searchUserName');
        this.usersService.getUsers(pageIndex, pageSize, searchUserName, searchTeam, searchBranch, searchRoom)
        .subscribe(users => {
            console.log(users, 'users');
            if(users.success) {
                this.users = users.data.data;
                this.total = users.data.total;
                this.filterTeamData = users.data.filterData.team;
                this.filterBranchData = users.data.filterData.branch;
                this.filterRoomData = users.data.filterData.room;
                this.selectedTeam = searchTeam;
                this.selectedBranch = searchBranch;
                this.selectedRoom = searchRoom;
            }
        });
    }

    searchUsername(): void {
        setTimeout( async () => {
            this.loadUsersList(this.pageIndex, this.pageSize, this.searchUser, this.selectedTeam, this.selectedBranch, this.selectedRoom);
        }, 500);
    }

    teamChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        this.loadUsersList(this.pageIndex, this.pageSize, this.searchUser, value, this.selectedBranch, this.selectedRoom);
    }

    branchChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        this.loadUsersList(this.pageIndex, this.pageSize, this.searchUser, this.selectedTeam, value, this.selectedRoom);
    }
    
    roomChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        this.loadUsersList(this.pageIndex, this.pageSize, this.searchUser, this.selectedTeam, this.selectedBranch, value);
    }
    // sendMessage(phoneNumber: string, contentMessage: string): void {
    //     this.loadingSendModal = true;
    //     this.incomService.sendMessage(phoneNumber, contentMessage)
    //     .subscribe(result => {
    //         if(result.success) {
    //             this.notification.create(
    //                 'success',
    //                 'Notification',
    //                 'Send message success'
    //             );
    //             this.loadMessageList(this.pageIndex, this.pageSize, null, null, '', '', this.searchDate[0], this.searchDate[1]);
    //         } else {
    //             this.notification.create(
    //                 'error',
    //                 'Send message fail',
    //                 `${result.code}`
    //             );
    //         }
    //         this.modalService.closeAll();
    //         this.resetSendModal();
    //     });
    // }

    // resetSendModal(): void {
    //     this.loadingSendModal = false;
    //     this.phoneNumber = '';
    //     this.contentMessage = '';
    //     this.requiredForm = {
    //         phoneNumber: false,
    //         content: false
    //     };
    // }

    showSendMessageModal(sendMessageContent: TemplateRef<{}>) {
        this.modalService.create({
            nzMaskClosable: false,
            nzTitle: 'New User',
            nzOnCancel: () => {
                //this.resetSendModal();
            },
            nzContent: sendMessageContent,
            nzFooter: [
                {
                    label: 'Create',
                    type: 'primary',
                    loading: () => this.loadingSendModal,
                    onClick: () => {
                        if(this.phoneNumber && this.contentMessage) {
                            this.requiredForm = false;
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
    
    // resetSendMultipleModal(): void {
    //     this.loadingSendMultipleModal = false;
    //     this.messagesList = [];
    // }

    // sendMultipleMessage(params): void {
    //     this.loadingSendMultipleModal = true;
    //     const list_params = {
    //         list_params: params
    //     };
    //     this.incomService.sendMultipleMessage(list_params)
    //     .subscribe(result => {
    //         if(result.successList.length > 0) {
    //             this.notification.create(
    //                 'success',
    //                 'Notification',
    //                 'Send message success'
    //             );
    //             this.loadMessageList(this.pageIndex, this.pageSize, null, null, '', '', this.searchDate[0], this.searchDate[1]);
    //         } else {
    //             this.notification.create(
    //                 'error',
    //                 'Send message fail',
    //                 `${result.errorList}`
    //             );
    //         }
    //         this.modalService.closeAll();
    //         this.resetSendMultipleModal();
    //     });
    // }
    
    // showSendMultipleMessageModal(sendMultipleMessageContent: TemplateRef<{}>) {
    //     this.modalService.create({
    //         nzMaskClosable: false,
    //         nzTitle: 'Send Multiple Message',
    //         nzOnCancel: () => {
    //         },
    //         nzContent: sendMultipleMessageContent,
    //         nzFooter: [
    //             {
    //                 label: 'Send',
    //                 type: 'primary',
    //                 loading: () => this.loadingSendMultipleModal,
    //                 onClick: () => {
    //                     if(this.messagesList.length > 0) {
    //                         this.sendMultipleMessage(this.messagesList);
    //                     } else {
    //                         this.notification.create(
    //                             'warning',
    //                             'Send message fail',
    //                             `No data to send`
    //                         );
    //                     }
    //                 },
    //             },
    //         ],
    //         nzWidth: 1500,
    //     })
    // }
    
    
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

    // removeMessageList(item): void {
    //     this.messagesList.splice(item, 1);
    //     this.messagesList = [...this.messagesList];
    // }

    // uploadFile(info: NzUploadFile, sendMultipleMessageContent: TemplateRef<{}>): void {
    //     if(info.type === 'progress') {
    //         // this.Showprogressbar();
    //         $('div.ant-upload-list-item').css('display','none');
    //         //$(this).children('div.ant-upload-list-item').style.cssText += 'display: none;';
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             const text = (<string>reader.result).split('\n');
    //             console.log(text, 'text');
    //             const arrText = [];
    //             for(const i of text) {
    //                 const textSplit = (<string>i).split('\t');
    //                 const content = textSplit[1].replace("\r", "");
    //                 arrText.push({
    //                     'phoneNumber': textSplit[0],
    //                     'content': content,
    //                 });
    //             }
    //             this.messagesList = arrText;
    //             this.showSendMultipleMessageModal(sendMultipleMessageContent);
    //         }
    //         reader.readAsText(info.file.originFileObj, "utf-8");
    //     }
    // }

    // onChangeDateRange(result: Date[]): void {
    //     if(result.length === 0) {
    //         result = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()];
    //     }
    //     this.loadMessageList(this.pageIndex, this.pageSize, null, null, this.searchPhone, this.selectedStatus, result[0], result[1]);
    // }
}