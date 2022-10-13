import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MessageIncom } from '../_models/message-incom';

@Injectable({ providedIn: 'root' })
export class UsersService {
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

  getUsers(pageIndex, pageSize, searchUserName, searchTeam, searchBranch, searchRoom, searchPermission) {
    return this.http.get<any>(`${environment.apiUrl}/internal/users?offset=${pageIndex}&page=${pageSize}&username=${searchUserName}&team=${searchTeam}&branch=${searchBranch}&room=${searchRoom}&permission=${searchPermission}`);
  }

  deleteUser(id, isActive) {
    const params = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        isActive
      },
    };
    return this.http.delete<any>(`${environment.apiUrl}/internal/user/${id}`, params)
  }

  updateUser(id, body) {
    // const params = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //   }),
    //   ...body,
    // };
    return this.http.put<any>(`${environment.apiUrl}/internal/user/${id}`, body)
  }

  createUser(params) {
    return this.http.post<any>(`${environment.apiUrl}/internal/user`, { ...params })
  }
}