import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  deactivateActivateUserURL,
  editUserURL,
  deleteOrganizationUser,
  activate_user_dittofi,
} from 'src/app/shared/static_data/apiURL';
import { AuthManagerService } from './auth-manager.service';

@Injectable({
  providedIn: 'root',
})
export class UserCredentialsService {
  token: string;
  username: string;

  constructor(
    private http: HttpClient,
    private authService: AuthManagerService
  ) {}


  deactivateActivateUserDittofi(user_id, toActivate) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')

    const params = new HttpParams().set('activate', toActivate);

    let promise = new Promise((resolve, reject) => {
      this.http
        .put(activate_user_dittofi(user_id, toActivate), null, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });

    return promise;
  }

  EditUser(user_id, user) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    return new Promise((resolve, reject) => {
      this.http
        .put(editUserURL + user_id, user, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  deleteUser(organizationId: string, userId: string) {
    console.log('user id: ' + userId);
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    return new Promise((resolve, reject) => {
      this.http
        .delete(deleteOrganizationUser(organizationId, userId), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
}
