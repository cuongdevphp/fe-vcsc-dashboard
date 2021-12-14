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

  getMessages(pageIndex, pageSize, sortField, sortOrder, filterPhone, filterStatus) {
    return this.http.get<MessageIncom>(`${environment.apiUrl}/supplier/sendMessageList?offset=${pageIndex}&page=${pageSize}&phonenumber=${filterPhone}&status=${filterStatus}`);
  }
}