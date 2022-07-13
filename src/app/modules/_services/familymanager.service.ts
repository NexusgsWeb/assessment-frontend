import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateParent } from 'src/app/shared/static_data/apiURL';
import { AuthManagerService } from './auth-manager.service';

@Injectable({
  providedIn: 'root',
})
export class FamilymanagerService {
  constructor(
    private http: HttpClient,
    private authService: AuthManagerService
  ) {}

  createParent(ParentToBeCreated, SchoolID) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());

    return new Promise((resolve, reject) => {
      this.http
        .post(CreateParent(SchoolID), ParentToBeCreated, { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
}
