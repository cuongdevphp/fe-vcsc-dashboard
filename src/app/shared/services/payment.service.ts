import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { filter } from 'rxjs/operators';

// const httpOptions = {
//   headers: new HttpHeaders({
//     "Content-Type": 'multipart/form-data'
//   })
// };
@Injectable({ providedIn: 'root' })
export class PaymentService {

  constructor(
      private router: Router,
      private http: HttpClient
  ) {

  }

  getPayments(pageIndex, pageSize, sortField, sortOrder, accountNumber, subNumber, startDate, endDate) {
    return this.http.get(`${environment.apiUrl}/payment/getList?offset=${pageIndex}&page=${pageSize}&accountNumber=${accountNumber}&subNumber=${subNumber}&startDate=${new Date(startDate).toISOString()}&endDate=${new Date(endDate).toISOString()}`);
  }

}