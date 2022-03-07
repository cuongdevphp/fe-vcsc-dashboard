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
}