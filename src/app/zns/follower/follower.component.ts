import { Component, OnInit, TemplateRef } from '@angular/core';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { IncomService } from 'src/app/shared/services/incom.service';
import { cloneDeep } from "lodash";
import * as common from '../../shared/common/common';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
declare var $: any; // JQuery
@Component({
    templateUrl: './follower.component.html'
})

export class FollowerComponent implements OnInit {
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
    requiredForm: any = {
        phoneNumber: false,
        content: false
    };
    
    constructor(
        private incomService: IncomService,
        private modalService: NzModalService,
        private notification: NzNotificationService,
        private http: HttpClient
    ) {
        //this.displayData = this.productsList
    }

    ngOnInit(): void {
        let users = JSON.parse(localStorage.getItem('user')) || [];
        //console.log(users, 'users');
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
                //this.loading = false;
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
        //this.loading = true;
        this.incomService.getSendMessageFollower(page, pageSize)
        .subscribe(data => {
            if(data.success) {
                //this.loading = false;
                this.dataMessageFollower = data.data.data;
                this.total = data.data.total;
                this.pageSize = pageSize;
                this.pageIndex = pageIndex;
            }
        });
    }

    editTemplateModal = (value, createTemplateContent) => {
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
            this.loadsendMessageFollowerList(this.pageIndex, this.pageSize);
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
      
        // this.modalService.create({
        //     nzMaskClosable: false,
        //     nzTitle: 'Image',
        //     nzOnCancel: () => {
        //         // this.resetTemplateModal();
        //     },
        //     nzContent: imageContent,
        //     nzFooter: [
        //         {
        //             label: 'OK',
        //             type: 'primary',
        //             onClick: () => {
        //                 // if(typeof this.editTemplate.id !== 'undefined') {
        //                 //     this.edit(this.editTemplate.id, this.editTemplate.name, this.editTemplate.template);
        //                 // } else {
        //                 //     this.create(data.name, data.template);
        //                 // }
        //             },
        //         },
        //     ],
        //     nzWidth: 700,
        // })
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
            this.loadsendMessageFollowerList(this.pageIndex, this.pageSize);
            this.modalService.closeAll();
            this.resetTemplateModal();
        });
    }

    showTemplateModal(data, createTemplateContent: TemplateRef<{}>) {
        this.modalService.create({
            nzMaskClosable: false,
            nzTitle: 'Send Message Follower',
            nzOnCancel: () => {
                this.resetTemplateModal();
            },
            nzContent: createTemplateContent,
            nzFooter: [
                {
                    label: 'Send',
                    type: 'primary',
                    loading: () => this.loadingSendMessageFollowerModal,
                    onClick: () => {
                        console.log(this.link);
                        console.log(this.imageUrl);
                        console.log(this.templateMessageFollowerId);
                        const objTemplate = this.lstTemplate.find(o => o.id === this.templateMessageFollowerId);
                        console.log(objTemplate, 'objTemplate');
                        
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

    fileList: NzUploadFile[] = [];
    previewImage: string | undefined = '';
    previewVisible = false;
    
    handlePreview = async (file: NzUploadFile): Promise<void> => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj!);
        }
        this.previewImage = file.url || file.preview;
        this.previewVisible = true;
    };

    async uploadImage(e) {
        console.log(e.target.files[0], 'e');

        // if(e.type === 'progress') {
            const formData = new FormData();
            // let files: FileList = e.target.files;
            // let file : File = files[0];
            // console.log(file, 'file');
            formData.append('dasdasdas', 'dsadasddsa');
            formData.append('image', e.target.files[0]);
            // You can use any AJAX library you like
            const req = new HttpRequest('POST', 'http://localhost:3001/incom/uploadImage', formData, {
            // reportProgress: true
            });
            this.http
            .request(req)
            .pipe(filter(e => e instanceof HttpResponse))
            .subscribe(
                () => {
                console.log('upload successfully.');
                },
                () => {
                console.log('upload failed.');
                }
            );
        // }
    }

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
            }
            this.modalService.closeAll();
            this.resetSendModal();
            console.log(result, 'resultdadsad')
            // if(result.success) {
            // this.notification.create(
            //     'success',
            //     'Notification',
            //     'Send message success'
            // );
            // } else {
            //     this.notification.create(
            //         'error',
            //         'Send message fail',
            //         `${result.code}`
            //     );
            // }
            // this.modalService.closeAll();
            // this.resetSendModal();
        });
    }

    resetSendModal(): void {
        this.loadingSendMessageFollowerModal = false;
        this.imageUrl = '';
        this.link = '';
        this.templateMessageFollowerId = '';
        this.fileList = [];
        // this.requiredForm = {
        //     phoneNumber: false,
        //     content: false
        // };
    }
    uploadImages(e) {
        if(e.type === 'progress') {
            console.log(e.fileList[0].originFileObj, 'e');
            const formData = new FormData();
            formData.append('image', e.fileList[0].originFileObj);
            // You can use any AJAX library you like
            const req = new HttpRequest('POST', 'http://localhost:3001/incom/uploadImage', formData, {
            // reportProgress: true
            });
                
            this.http
            .request(req)
            .subscribe(
                (result) => {
                    if(result['status'] === 200) {
                        this.imageUrl = result['body']['path'];
                        console.log('upload successfully.');
                    }
                },
                () => {
                    console.log('upload failed.');
                }
            );
        }
    }
}

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
