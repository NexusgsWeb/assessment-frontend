import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getLearningObjectivesByDomainURL } from 'src/app/shared/static_data/apiURL';
import { AuthManagerService } from './auth-manager.service';

@Injectable({
  providedIn: 'root',
})
export class LearningobjectiveManagerService {
  constructor(
    private authService: AuthManagerService,
    private http: HttpClient
  ) {}

  // getLearningObjectiveByDomainID(domainID) {
  //   const headers = new HttpHeaders()
  //     .set('content-type', 'application/json')
  //     .set('Authorization', this.authService.getToken());
  //   return new Promise((resolve, reject) => {
  //     this.http
  //       .get(getLearningObjectivesByDomainURL(domainID), {
  //         headers: headers,
  //       })
  //       .toPromise()
  //       .then((res) => resolve(res))
  //       .catch((err) => reject(err));
  //   });
  // }
}
