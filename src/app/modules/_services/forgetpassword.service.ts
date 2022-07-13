import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  forgetPasswordURL,
  hardResetPasswordURL,
  resetPasswordURL,
} from '../../shared/static_data/apiURL';
import { AuthManagerService } from './auth-manager.service';

@Injectable({
  providedIn: 'root',
})
export class ForgetpasswordService {
  constructor(
    private http: HttpClient,
    private authService: AuthManagerService
  ) {}

  forgetPasswordRequest(email, type) {
    let params = new HttpParams();
    params = params.append('type', type);

    return new Promise((resolve, reject) => {
      this.http
        .post(forgetPasswordURL, { email: email }, { params: params })
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }

  resetPasswordRequest(type, token, newpassword) {
    let params = new HttpParams().set('type', type).set('token', token);

    return new Promise((resolve, reject) => {
      this.http
        .post(resetPasswordURL, { password: newpassword }, { params: params })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
  forceResetPassword(user_ID, newPassword) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    return new Promise((resolve, reject) => {
      this.http
        .patch(
          hardResetPasswordURL(user_ID),
          { password: newPassword },
          { headers: headers }
        )
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }
}
