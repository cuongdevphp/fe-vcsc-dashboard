import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MessageIncom } from '../_models/message-incom';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private messageSubject: BehaviorSubject<MessageIncom>;
  public message: Observable<MessageIncom>;

  constructor(
      private http: HttpClient
  ) {

  }

  public get messageValue(): MessageIncom {
      return this.messageSubject.value;
  }
  
  getQtyAccount(startDate, endDate) {
    return this.http.get<any>(`${environment.apiUrl}/report/qtyAccount?startDate=${new Date(startDate).toISOString()}&endDate=${new Date(endDate).toISOString()}`);
  }

  getCommission(startDate, endDate) {
    return this.http.get<any>(`${environment.apiUrl}/report/commission?startDate=${new Date(startDate).toISOString()}&endDate=${new Date(endDate).toISOString()}`);
  }
}