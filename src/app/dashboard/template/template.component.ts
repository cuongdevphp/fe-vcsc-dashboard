import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TemplateService } from 'src/app/shared/services/template.service';
import * as CKSource from '../../../../ckeditor/build/cksource';

const ClassicEditor = CKSource.ClassicEditor;

declare var $: any; // JQuery
@Component({
    templateUrl: './template.component.html',
})

export class TemplateDashboardComponent implements OnInit {
    // @ViewChild('useThisTemplateVar') elRef: ElementRef; 
//     public config = {    toolbar: {
//         items: [ 'bold', 'italic', '|', 'undo', 'redo' ],    
//         shouldNotGroupWhenFull: false
//     }
// };
	public Editor = ClassicEditor;
    
    // public editorData =
    // `<p class="body"><strong>Kính gửi: ##SexTp## ##AccountName## </strong></p>
    // <p class="body">Số tài khoản: ##AccountNo## </p>
    // <p class="body">Địa chỉ: ##ContactAddress## </p>
    // <p align="center" class="body"><strong>THÔNG BÁO VỀ VIỆC ##Title## CỔ PHIẾU</strong></p>
    // <p align="left" class="body">Căn cứ vào danh sách phân bổ quyền của Trung tâm lưu ký chứng khoán, Công ty cổ phần chứng khoán Bản Việt (VCSC) trân trọng thông báo tới Quý khách hàng về việc ##Title## cổ phiếu như sau:</p>
    // <p align="left" class="body">Tên chứng khoán: <strong>##StockNameVI##</strong></p>
    // <p align="left" class="body">Mã chứng khoán: <strong>##TickerID##</strong></p>
    // <p align="left" class="body">Số lượng: <strong>##Quantity##</strong></p>
    // <p align="left" class="body">Ngày: <strong>##Date##</strong></p>
    // <p class="body">Mọi thắc mắc, vui lòng liên hệ theo số điện thoại (+84) 28888 2 6868.<br />
    //   <br />
    //   Trân trọng,</p>
    //   <p class="MsoNormal1" style="margin-bottom:.0001pt;line-height:normal;text-autospace:none;"><span style="font-family: 'Arial','sans-serif'; color: #004080; font-weight: bold; font-size: 11pt;">Phòng Dịch vụ Khách hàng  &amp; Quản lý Sản phẩm</span></p>
    // <p class="MsoNormal1" style="margin-top:0in;margin-right:0in;margin-bottom:.0001pt;margin-left:.75pt;line-height:normal;text-autospace:none;"><strong><span style="font-family: 'Arial','sans-serif'; font-size: 9.0pt; color: #004080; font-weight: bold;">Công ty Cổ phần Chứng khoán Bản Việt (VCSC)</span></strong></p>
    // <p class="MsoNormal1" style="margin-top:0in;margin-right:0in;margin-bottom:.0001pt;margin-left:.75pt;line-height:normal;text-autospace:none;"><span style="font-family:'Arial','sans-serif'; font-size:9.0pt; color:#5F5F5F; ">Tòa nhà Vinatex, lầu 1, 10 Nguyễn Huệ, Quận 1, Tp.HCM, Việt Nam<br />
    //   T (+84) 28888 2 6868 |  F (+84) 28 3914 3577</span></p>
    // <p class="MsoNormal1"><span style="line-height:115%; font-family:'Arial','sans-serif'; font-size:9.0pt; color:black; "><br />
    // </span><a href="http://www.vcsc.com.vn"><span style="font-family:'Arial','sans-serif'; font-size:9.0pt; color:black; ">www.vcsc.com.vn</span></a><span style="font-family:'Arial','sans-serif'; font-size:9.0pt; color:black; "> </span></p>
    
    // `;
    
	public componentEvents: string[] = [];
	public onReady(): void {
		this.componentEvents.push( 'The editor is ready.' );
	}

	public onChange(): void {
		this.componentEvents.push( 'Editor model changed.' );
	}

	public onFocus(): void {
		this.componentEvents.push( 'Focused the editing view.' );
	}

	public onBlur(): void {
		this.componentEvents.push( 'Blurred the editing view.' );
	}

	public onError(): void {
		this.componentEvents.push( 'The editor crashed.' );
	}
    
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
    templates:any = null;
    pageSize = 10;
    pageIndex = 1; 

    template_name = '';
    subject = '';
    template_code = '';
    language = '';
    html = '';
    idTemplate = '';
    // formCreateName = '';
    // formCreatePassword = '';
    // formCreatePermission = '';
    // formCreateCode = '';
    // formCreateBranch = '';
    // formCreateRoom = '';
    // formCreateTeam = '';
    // formCreateNote = '';
    templateForm: FormGroup;
    submitted = false;


    allChecked:boolean = false;
    loading = false;
    dateFormat = 'dd/MM/yyyy';
    total = null;
    indeterminate:boolean = false;
    messagesList:any = null;
    phoneNumber: any = '';
    contentMessage: any = '';
    loadingTemplateModal = false;
    loadingSendMultipleModal = false;
    requiredForm: any = {
        phoneNumber: false,
        content: false
    };
    
    constructor(
        private fb: FormBuilder,
        private templateService: TemplateService,
        private modalService: NzModalService,
        private nzMessageService: NzMessageService
    ) {

    }

    get f() { return this.templateForm.controls; }

    ngOnInit(): void {
        this.templateForm = this.fb.group({
            template_name: [ null, [ Validators.required ] ],
            subject: [ null, [ Validators.required ] ],
            template_code: [ null, [ Validators.required ] ],
            language: [ null, [ Validators.required ] ],
            html: [ null, [ Validators.required ] ]
        });
        let users = JSON.parse(localStorage.getItem('user')) || [];
        this.localStorageUser = users;
        this.loadTemplatesList(this.pageIndex, this.pageSize, this.searchUser, this.selectedTeam, this.selectedBranch, this.selectedRoom, this.selectedPermission);        
    }
    
    
    showCreateUserModal(data, templateFormContent: TemplateRef<{}>) {
        setTimeout(() =>{
            (document.querySelector('.ck-toolbar_grouping') as HTMLElement).style.fontSize = '11px';
        }, 400)
        this.idTemplate = '0';
        if(data) {
            this.template_name = data.template_name;
            this.template_code = data.template_code;
            this.idTemplate = data.id; 
            this.language = data.language;
            this.subject = data.subject;
            this.html = data.html;
        }
        this.modalService.create({
            nzMaskClosable: false,
            nzTitle: (data ? 'Edit Template' : 'New Template'),
            nzOnCancel: () => {
                this.templateForm.reset();
            },
            nzContent: templateFormContent,
            nzFooter: [
                {
                    label: (data ? 'Edit' : 'Create'),
                    type: 'primary',
                    loading: () => this.loadingTemplateModal,
                    onClick: () => {
                        this.submitTemplate();
                    },
                },
            ],
            nzWidth: 1000,
        })
    }

    submitTemplate(): void {
        console.log(this.templateForm, 'this.templateForm');
        this.submitted = true;
        if (this.templateForm.invalid) {
            return;
        }
        const params = {
            'template_name': this.f.template_name.value, 
            'template_code': this.f.template_code.value, 
            'subject': this.f.subject.value, 
            'language': this.f.language.value, 
            'html': this.f.html.value, 
        };
        console.log(params, 'params');
        this.templateService.updateTemplate(this.idTemplate, params).subscribe(result => {
            if(result.success) {
                this.nzMessageService.create('success', result.message);
                this.templateForm.reset();
                this.modalService.closeAll();
                this.loadTemplatesList(this.pageIndex, this.pageSize, this.searchUser, this.selectedTeam, this.selectedBranch, this.selectedRoom, this.selectedPermission);        
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
        // this.usersService.deleteUser(id, isActive).subscribe(result => {
        //     if(result.success) {
        //         this.nzMessageService.create('success', result.message);
        //     } else {
        //         this.nzMessageService.error('Update status error');
        //     }
        // });
    }
    
    onQueryParamsChange(params: NzTableQueryParams): void {
        const { pageSize, pageIndex, sort } = params;
        this.loadTemplatesList(pageIndex, pageSize, this.searchUser, this.selectedTeam, this.selectedBranch, this.selectedRoom, this.selectedPermission);
    }
    
    loadTemplatesList(
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
        // this.loading = true;
        this.templateService.getTemplates(page, pageSize)
        .subscribe(template => {
            console.log(template, 'users');
            if(template.success) {
                this.templates = template.data.data;
                this.total = template.data.total;
                // this.filterTeamData = users.data.filterData.team;
                // this.filterBranchData = users.data.filterData.branch;
                // this.filterRoomData = users.data.filterData.room;
                // this.filterPermissionData = users.data.filterData.permission;
                // this.selectedTeam = searchTeam;
                // this.selectedBranch = searchBranch;
                // this.selectedRoom = searchRoom;
                // this.selectedPermission = searchPermission;
            }
        });
    }
    
    cancelEditUser(id: string): void {
        // const index = this.users.findIndex(item => item.id === id);
        // this.editCache[id] = {
        //     data: { ...this.users[index] },
        //     edit: false
        // };
    }
    
    saveEditUser(id: string): void {
        // const index = this.users.findIndex(item => item.id === id);
        // Object.assign(this.users[index], this.editCache[id].data);
        // const data = {
        //     name: this.editCache[id].data['name'], 
        //     note: this.editCache[id].data['note'], 
        //     code: this.editCache[id].data['code'], 
        //     team: this.editCache[id].data['team'], 
        //     branch: this.editCache[id].data['branch'], 
        //     room: this.editCache[id].data['transaction_room'], 
        //     permission: this.editCache[id].data['permission'], 
        //     vcsc: `V${this.editCache[id].data['branch']}${this.editCache[id].data['transaction_room']}${this.editCache[id].data['team']}`, 
        // };
        // this.usersService.updateUser(id, data).subscribe(result => {
        //     if(result.success) {
        //         this.editCache[id].edit = false;
        //         this.nzMessageService.create('success', result.message);
        //     } else {
        //         this.nzMessageService.error('Update user error');
        //     }
        // });
    }
    
    searchUsername(): void {
        setTimeout( async () => {
            // this.loadUsersList(this.pageIndex, this.pageSize, this.searchUser, this.selectedTeam, this.selectedBranch, this.selectedRoom, this.selectedPermission);
        }, 600);
    }

    teamChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        // this.loadUsersList(this.pageIndex, this.pageSize, this.searchUser, value, this.selectedBranch, this.selectedRoom, this.selectedPermission);
    }

    branchChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        // this.loadUsersList(this.pageIndex, this.pageSize, this.searchUser, this.selectedTeam, value, this.selectedRoom, this.selectedPermission);
    }
    
    roomChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        // this.loadUsersList(this.pageIndex, this.pageSize, this.searchUser, this.selectedTeam, this.selectedBranch, value, this.selectedPermission);
    }

    permissionChange(value: string): void {
        if(value === 'All') {
            value = '';
        }
        // this.loadUsersList(this.pageIndex, this.pageSize, this.searchUser, this.selectedTeam, this.selectedBranch, this.selectedRoom, value);
    }
}