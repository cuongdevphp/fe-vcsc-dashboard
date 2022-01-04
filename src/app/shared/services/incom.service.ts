import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MessageIncom } from '../_models/message-incom';

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
    return this.http.get<MessageIncom>(`${environment.apiUrl}/supplier/sendMessageList?offset=${pageIndex}&page=${pageSize}&phonenumber=${filterPhone}&status=${filterStatus}&startDate=${new Date(startDate).toISOString()}&endDate=${new Date(endDate).toISOString()}`);
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
    return this.http.post<any>(`${environment.apiUrl}/supplier/sendMessage`, { ...params })
  }

  sendMultipleMessage(params) {
    return this.http.post<any>(`${environment.apiUrl}/supplier/sendMultipleMessage`, { ...params })
  }

  getStatistic() {
    return this.http.get<any>(`${environment.apiUrl}/supplier/statistic`);
  }
}