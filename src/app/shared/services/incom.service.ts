import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MessageIncom } from '../_models/message-incom';
import { filter } from 'rxjs/operators';

// const httpOptions = {
//   headers: new HttpHeaders({
//     "Content-Type": 'multipart/form-data'
//   })
// };
@Injectable({ providedIn: 'root' })
export class IncomService {
  private messageSubject: BehaviorSubject<MessageIncom>;
  public message: Observable<MessageIncom>;

  constructor(
      private router: Router,
      private http: HttpClient
  ) {

  }

  public get messageValue(): MessageIncom {
      return this.messageSubject.value;
  }

  getMessages(pageIndex, pageSize, sortField, sortOrder, filterPhone, filterStatus, startDate, endDate) {
    return this.http.get<MessageIncom>(`${environment.apiUrl}/incom/sendMessageList?offset=${pageIndex}&page=${pageSize}&phonenumber=${filterPhone}&status=${filterStatus}&startDate=${new Date(startDate).toISOString()}&endDate=${new Date(endDate).toISOString()}`);
  }

  getTemplates(pageIndex, pageSize) {
    return this.http.get<MessageIncom>(`${environment.apiUrl}/incom/template?offset=${pageIndex}&page=${pageSize}`);
  }

  getSendMessageFollower(pageIndex, pageSize) {
    return this.http.get<MessageIncom>(`${environment.apiUrl}/incom/sendMessageFollower?offset=${pageIndex}&page=${pageSize}`);
  }

  createTemplate(data) {
    const params = {
      'name': data.name, 
      'template': data.template
    }
    return this.http.post<any>(`${environment.apiUrl}/incom/template`, { ...params })
  }
  
  sendMessageFollower(data) {
    const params = {
      'image_url': data.image_url, 
      'url': data.url,
      'template_id': data.template_id,
      'template_content': data.template_content,
      'template_title': data.template_title,
    }
    return this.http.post<any>(`${environment.apiUrl}/incom/sendMessageFollower`, { ...params })
  }

  uploadImage(data) {
    const req = new HttpRequest('POST', 'http://localhost:3001/incom/uploadImage', data, {
      // reportProgress: true
    });
    return this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
    // return this.http.post<any>(`http://localhost:3001/incom/uploadImage`, data)
  }

  editTemplate(id, data) {
    const params = {
      'name': data.name, 
      'template': data.template
    }
    return this.http.put<any>(`${environment.apiUrl}/incom/template/${id}`, { ...params })
  }

  sendMessage(phoneNumber, contentMessage) {
    const params = {
      'phonenumber': phoneNumber, 
      'routerule': ["3"],
      'templatecode': 'vcsc-freetemp',
      'list_param': {
        'sendstr': contentMessage
      }
    }
    return this.http.post<any>(`${environment.apiUrl}/incom/sendMessage`, { ...params })
  }

  sendMultipleMessage(params) {
    return this.http.post<any>(`${environment.apiUrl}/incom/sendMultipleMessage`, { ...params })
  }

  getStatistic() {
    return this.http.get<any>(`${environment.apiUrl}/incom/statistic`);
  }
}