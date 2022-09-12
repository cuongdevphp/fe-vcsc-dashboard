import { Component, OnInit, TemplateRef } from '@angular/core';
// import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { IncomService } from 'src/app/shared/services/incom.service';
import { cloneDeep } from "lodash";

import { environment } from '../../../environments/environment';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any; // JQuery
@Component({
    templateUrl: './follower.component.html'
})

export class FollowerComponent implements OnInit {
    sendMessageFollowerForm: FormGroup;
    loadingSendMessageFollowerModal: boolean = false;
    allChecked:boolean = false;
    loading = false;
    pageSize = 10;
    dateFormat = 'dd/MM/yyyy';
    searchDate = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()];
    pageIndex = 1;
    imageMessageFollow: any = '';
    total = null;
    indeterminate:boolean = false;
    dataMessageFollower:any = null;
    link: any = '';
    imageUrl: any = '';
    selectedStatus: any = '';
    templateMessageFollowerId: any = '';
    lstTemplate: any = null;
    searchPhone: any = '';
    phoneNumber: any = '';
    editTemplate: any = null;
    contentMessage: any = '';
    loadingTemplateModal = false;
    submitted = false;
    requiredImage = false;
    fileList: NzUploadFile[] = [];
    previewImage: string | undefined = '';
    previewVisible = false;
    // pathUploadImage = `${environment.apiUrlProd}/incom/uploadImage`;
    
    constructor(
        private fb: FormBuilder,
        private incomService: IncomService,
        private modalService: NzModalService,
        private notification: NzNotificationService,
        private http: HttpClient
    ) {
        //this.displayData = this.productsList
    }

    get f() { return this.sendMessageFollowerForm.controls; }
    ngOnInit(): void {
        this.sendMessageFollowerForm = this.fb.group({
            link: [ null, [ Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?') ] ],
            templateMessageFollowerId: [ null, [ Validators.required ] ],
        });
        let users = JSON.parse(localStorage.getItem('user')) || [];
        this.loadsendMessageFollowerList(this.pageIndex, this.pageSize);
        this.loadTemplateList();
    }
    
    onQueryParamsChange(params: NzTableQueryParams): void {
        const { pageSize, pageIndex } = params;
        this.loadsendMessageFollowerList(pageIndex, pageSize);
    }
    
    loadTemplateList(): void {
        this.incomService.getTemplates(0, 100)
        .subscribe(templates => {
            if(templates.success) {
                this.lstTemplate = templates.data.data;
            }
        });
    }

    loadsendMessageFollowerList(
        pageIndex: number,
        pageSize: number,
    ): void {
        let page = 0;
        if(pageIndex !== 1) {
            page = pageSize * (pageIndex - 1);
        }
        this.incomService.getSendMessageFollower(page, pageSize)
        .subscribe(data => {
            if(data.success) {
                this.dataMessageFollower = data.data.data;
                this.total = data.data.total;
                this.pageSize = pageSize;
                this.pageIndex = pageIndex;
            }
        });
    }

    editTemplateModal = (value, createTemplateContent) => {
        this.editTemplate = cloneDeep(value);
        this.showSendMessageFollowerModal(value, createTemplateContent);
    }

    convertDDMMYYYYHHMM = (date) => {
        // return moment(new Date(date)).format('DD/MM/YYYY HH:mm');
    }

    createTemplateModal = (value, createTemplateContent) => {
        console.log(value, 'fsdf');
        this.editTemplate = {
            name: '',
            template: ''
        };
        this.showSendMessageFollowerModal(this.editTemplate, createTemplateContent);
    }

    showImage = (value, imageContent) => {
        this.imageMessageFollow = value;
        this.showImageModal(imageContent);
    }
    
    showImageModal(imageContent: TemplateRef<{}>) {
        this.modalService.info({
            nzTitle: 'Image',
            nzContent: imageContent,
            nzWidth: 800,
            nzOnOk: () => console.log('Info OK')
        });
    }

    showSendMessageFollowerModal(data, createTemplateContent: TemplateRef<{}>) {
        this.modalService.create({
            nzMaskClosable: false,
            nzTitle: 'Send Message Follower',
            nzOnCancel: () => {
                this.resetSendModal();
            },
            nzContent: createTemplateContent,
            nzFooter: [
                {
                    label: 'Send',
                    type: 'primary',
                    loading: () => this.loadingSendMessageFollowerModal,
                    onClick: () => {
                        this.submitted = true;
                        if (this.sendMessageFollowerForm.invalid) {
                            return;
                        }
                        if(this.imageUrl === '') {
                            this.requiredImage = true;
                            return;
                        }
                        const objTemplate = this.lstTemplate.find(o => o.id === this.templateMessageFollowerId);
                        
                        const params = {
                            'image_url': this.imageUrl, 
                            'url': this.link,
                            'template_id': this.templateMessageFollowerId,
                            'template_content': objTemplate.template,
                            'template_title': objTemplate.name,
                        };
                        this.sendMessageFollower(params);
                    },
                },
            ],
            nzWidth: 1000,
        })
    }

    
    handlePreview = async (file: NzUploadFile): Promise<void> => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj!);
        }
        this.previewImage = file.url || file.preview;
        this.previewVisible = true;
    };

    // async uploadImage(e) {
    //     const formData = new FormData();
    //     formData.append('dasdasdas', 'dsadasddsa');
    //     formData.append('image', e.target.files[0]);
    //     const req = new HttpRequest('POST', 'http://localhost:3001/incom/uploadImage', formData, {
    //         // reportProgress: true
    //     });
    //     this.http
    //     .request(req)
    //     .pipe(filter(e => e instanceof HttpResponse))
    //     .subscribe(
    //         () => {
    //         console.log('upload successfully.');
    //         },
    //         () => {
    //         console.log('upload failed.');
    //         }
    //     );
    // }

    sendMessageFollower(data): void {
        this.loadingSendMessageFollowerModal = true;
        console.log(data, 'data');
        this.incomService.sendMessageFollower(data)
        .subscribe(result => {
            if(result.success) {
                this.notification.create(
                    'success',
                    'Notification',
                    'Send message success'
                );
                this.loadsendMessageFollowerList(this.pageIndex, this.pageSize);
            } else {
                this.notification.create(
                    'error',
                    'Send notify ZNS fail',
                    result.message
                );
            }
            this.modalService.closeAll();
            this.resetSendModal();
        });
    }

    resetSendModal(): void {
        this.loadingSendMessageFollowerModal = false;
        this.imageUrl = '';
        this.link = '';
        this.templateMessageFollowerId = '';
        this.fileList = [];
        this.requiredImage = false;
        this.sendMessageFollowerForm.reset();
    }
    // checkLink (e) {
    //     const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    //     Validators.pattern(reg)
    //     console.log(e, 'fds');
    // }
    uploadImages(e) {
        console.log(e.type, 'e.type');
        // if(e.type === 'progress') {
        //     const formData = new FormData();
        //     formData.append('image', e.fileList[0].originFileObj);
        //     // You can use any AJAX library you like
        //     const req = new HttpRequest('POST', `${environment.apiUrlProd}/incom/uploadImage`, formData, {
        //         // reportProgress: true
        //     });

        //     this.http
        //     .request(req)
        //     .subscribe(
        //         (result) => {
        //             if(result['status'] === 200) {
        //                 this.imageUrl = `http://zns.vcsc.com.vn:3001/assets/zns/uploads/${result['body']['path']}` ;
        //                 console.log('upload successfully.');
        //                 this.requiredImage = false;
        //             }
        //         },
        //         () => {
        //             console.log('upload failed.');
        //         }
        //     );
        // } else if (e.type === 'removed') {
        //     this.requiredImage = true;
        //     this.imageUrl = `` ;
        // }
    }
}

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
