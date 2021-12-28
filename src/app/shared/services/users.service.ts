import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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

  getUsers(pageIndex, pageSize, searchUserName, searchTeam, searchBranch, searchRoom) {
    return this.http.get<any>(`${environment.apiUrl}/internal/getUsers?offset=${pageIndex}&page=${pageSize}&username=${searchUserName}&team=${searchTeam}&branch=${searchBranch}&room=${searchRoom}`);
  }
}