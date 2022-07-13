import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  addRemarkForQuestionkURL,
  getRemarksForQuestionURL,
  addRemarkForQuestionkURLDittofi,
} from 'src/app/shared/static_data/apiURL';
import { AuthManagerService } from './auth-manager.service';

@Injectable({
  providedIn: 'root',
})
export class RemarksmanagerService {
  constructor(
    private authService: AuthManagerService,
    private http: HttpClient
  ) {}
  getRemarksForQuestion(QuestionID) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    return new Promise((resolve, reject) => {
      this.http
        .get(getRemarksForQuestionURL(QuestionID), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }


  addRemarksForQuestionDittofi(QuestionID, Remark) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')

    return new Promise((resolve, reject) => {
      this.http
        .post(addRemarkForQuestionkURLDittofi(QuestionID), Remark, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

}
