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

  getBanks() {
    return this.http.get(`https://api.vietqr.io/v2/banks`);
  }
  // "accountName": "cuongdev",
  // "accountNo": "068C01816200",
  // "amount": 10000,
  // "branch": "01",
  // "bankId": 38
//   generateVietQrCode(data) {
//     // const params = {
//     //   "accountNo": data.accountNo,
//     //   "accountName": data.accountName,
//     //   "acqId": data.acqId,
//     //   "addInfo": data.addInfo,
//     //   "amount": data.amount,
//     //   "template": "compact2"
//     // }
//     const params = {
//       const params = {
//         headers: new HttpHeaders({
//           'Content-Type': 'application/json',
//         }),
//         ...data,
//       };
//       return this.http.post<any>(`${environment.apiUrl}/internal/user/${id}`, params)
  

//     //   "accountName": data.accountName,
//     //   "accountNo": data.accountNo,
//     //   "amount": data.amount,
//     //   "branch": data.branch,
//     //   "bankId": data.bankId
//     // }
//     // return this.http.post<any>(`https://api.vietqr.io/v2/generate`, { ...params })
//   // }
// }
  generateVietQrCode(body) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': '7D459aF8551Db7603bF7997C0357C95169F43c76'
      }),
    };
    return this.http.post<any>(`http://10.11.0.8:3001/qrcode`, { headers: headers}, ...body)
  }
}