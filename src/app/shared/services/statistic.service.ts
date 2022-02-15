import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StatisticService {

  constructor(
      private http: HttpClient
  ) {

  }

  getSessionLogin(date) {
    return this.http.get<any>(`${environment.apiUrl}/statistic/sessionLogin?date=${new Date(date).toISOString()}`);
  }
}