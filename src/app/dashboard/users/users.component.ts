import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UsersService } from 'src/app/shared/services/users.service';
declare var $: any; // JQuery
@Component({
    templateUrl: './users.component.html'
})

export class UsersDashboardComponent implements OnInit {  
    editCache: { [key: string]: { edit: boolean; data: [] } } = {};
    localStorageUser: any = null;
    filterTeamData: any = null;
    filterBranchData: any = null;
    filterRoomData: any = null;
    filterPermissionData: any = null;
    searchUser: any = '';
    selectedTeam: any = '';
    selectedBranch: any = '';
    selectedRoom: any = '';
    selectedPermission: any = '';
    users:any = null;
    pageSize = 10;
    pageIndex = 1; 

    formCreateVCSC = '';
    formCreateUsername = '';
    formCreateName = '';
    formCreatePassword = '';
    formCreatePermission = '';
    formCreateCode = '';
    formCreateBranch = '';
    formCreateRoom = '';
    formCreateTeam = '';
    formCreateNote = '';
    createUserForm: FormGroup;
    submitted = false;


    allChecked:boolean = false;
    loading = false;
    dateFormat = 'dd/MM/yyyy';
    total = null;
    indeterminate:boolean = false;
    messagesList:any = null;
    phoneNumber: any = '';
    contentMessage: any = '';
    loadingCreateUserModal = false;
    loadingSendMultipleModal = false;
    requiredForm: any = {
        phoneNumber: false,
        content: false
    };
    
    constructor(
        private fb: FormBuilder,
        private usersService: UsersService,
        private modalService: NzModalService,
        private nzMessageService: NzMessageService
    ) {

    }

    get f() { return this.createUserForm.controls; }

    ngOnInit(): void {
        this.createUserForm = this.fb.group({
            username: [ null, [ Validators.required ] ],
            password: [ null, [ Validators.required ] ],
            name: [ null, [ Validators.required ] ],
            permission: [ null, [ Validators.required ] ],
            branch: [ null, [ Validators.required ] ],
            team: [ null, [ Validators.required ] ],
            room: [ null, [ Validators.required ] ],
            note: [ null, [] ],
            code: [ null, [] ],
        });
        let users = JSON.parse(localStorage.getItem('user')) || [];
        this.localStorageUser = users;
        this.loadUsersList(this.pageIndex, this.pageSize, this.searchUser, this.selectedTeam, this.selectedBranch, this.selectedRoom, this.selectedPermission);        
    }
    
    
    showCreateUserModal(createUserFormContent: TemplateRef<{}>) {
        this.modalService.create({
            nzMaskClosable: false,
            nzTitle: 'New User',
            nzOnCancel: () => {
                this.createUserForm.reset();
            },
            nzContent: createUserFormContent,
            nzFooter: [
                {
                    label: 'Create',
                    type: 'primary',
                    loading: () => this.loadingCreateUserModal,
                    onClick: () => {
                        this.submitCreateUser();
                    },
                },
            ],
            nzWidth: 600,
        })
    }

    submitCreateUser(): void {
        this.submitted = true;
        if (this.createUserForm.invalid) {
            return;
        }
        const params = {
            'username': this.f.username.value, 
            'password': this.f.password.value, 
            'name': this.f.name.value, 
            'permission': this.f.permission.value, 
            'branch': this.f.branch.value, 
            'team': this.f.team.value, 
            'room': this.f.room.value, 
            'code': this.f.code.value, 
            'note': this.f.note.value, 
            'vcsc': `V${this.f.branch.value}${this.f.room.value}${this.f.team.value}`
        };

        this.usersService.createUser(params).subscribe(result => {
            if(result.success) {
                this.nzMessageService.create('success', result.message);
                this.createUserForm.reset();
                this.modalService.closeAll();
                this.loadUsersList(this.pageIndex, this.pageSize, this.searchUser, this.selectedTeam, this.selectedBranch, this.selectedRoom, this.selectedPermission);
            } else {
                this.nzMessageService.error(result.message);
                this.modalService.closeAll();
            }
        });
    }

    cancel(): void {
        console.log('click cancel');
    }
    
    changeStatusActive(item: any): void {
        const id = item.id;
        const isActive = item.active ? 1 : 0; 
        this.usersService.deleteUser(id, isActive).subscribe(result => {
            if(result.success) {
                this.nzMessageService.create('success', result.message);
            } else {
                this.nzMessageService.error('Update status error');
            }
        });
    }
    
    onQueryParamsChange(params: NzTableQueryParams): void {
        const { pageSize, pageIndex, sort } = params;
        this.loadUsersList(pageIndex, pageSize, this.searchUser, this.selectedTeam, this.selectedBranch, this.selectedRoom, this.selectedPermission);
    }
    
    loadUsersList(
        pageIndex: number,
        pageSize: number,
        searchUserName: string,
        searchTeam: string,
        searchBranch: string,
        searchRoom: string,
        searchPermission: string,
    ): void {
        let page = 0;
        if(pageIndex !== 1) {
            page = pageSize * (pageIndex - 1);
        }
        //this.loading = true;
        this.usersService.getUsers(page, pageSize, searchUserName, searchTeam, searchBranch, searchRoom, searchPermission)
        .subscribe(users => {
            if(users.success) {
                this.users = users.data.data;
                this.users.forEach(item => {
                    this.editCache[item.id] = {
                        edit: false,
                        data: { ...item }
                    };
                });
                this.total = users.data.total;
                this.filterTeamData = users.data.filterData.team;
                this.filterBranchData = users.data.filterData.branch;
                this.filterRoomData = users.data.filterData.room;
                this.filterPermissionData = users.data.filterData.permission;
                this.selectedTeam = searchTeam;
                this.selectedBranch = searchBranch;
                this.selectedRoom = searchRoom;
                this.selectedPermission = searchPermission;
            }
        });
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }
    
    cancelEditUser(id: string): void {
        const index = this.users.findIndex(item => item.id === id);
        this.editCache[id] = {
            data: { ...this.users[index] },
            edit: false
        };
    }
    
    saveEditUser(id: string): void {
        const index = this.users.findIndex(item => item.id === id);
        Object.assign(this.users[index], this.editCache[id].data);
        const data = {
            name: this.editCache[id].data['name'], 
            note: this.editCache[id].data['note'], 
            code: this.editCache[id].data['code'], 
            team: this.editCache[id].data['team'], 
            branch: this.editCache[id].data['branch'], 
            room: this.editCache[id].data['transaction_room'], 
            permission: this.editCache[id].data['permission'], 
            vcsc: `V${this.editCache[id].data['branch']}${this.editCache[id].data['transaction_room']}${this.editCache[id].data['team']}`, 
        };
        this.usersService.updateUser(id, data).subscribe(result => {
            if(result.success) {
                this.editCache[id].edit = false;
                this.nzMessageService.create('success', result.message);
            } else {
                this.nzMessageService.error('Update user error');
            }
        });
    }
    
    searchUsername(): void {
        setTimeout( async () => {
            this.loadUsersList(this.pageIndex, this.pageSize, this.searchUser, this.selectedTeam, this.selectedBranch, this.selectedRoom, this.selectedPermission);
        }, 600);
    }

    teamChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        this.loadUsersList(this.pageIndex, this.pageSize, this.searchUser, value, this.selectedBranch, this.selectedRoom, this.selectedPermission);
    }

    branchChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        this.loadUsersList(this.pageIndex, this.pageSize, this.searchUser, this.selectedTeam, value, this.selectedRoom, this.selectedPermission);
    }
    
    roomChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        this.loadUsersList(this.pageIndex, this.pageSize, this.searchUser, this.selectedTeam, this.selectedBranch, value, this.selectedPermission);
    }

    permissionChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        this.loadUsersList(this.pageIndex, this.pageSize, this.searchUser, this.selectedTeam, this.selectedBranch, this.selectedRoom, value);
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