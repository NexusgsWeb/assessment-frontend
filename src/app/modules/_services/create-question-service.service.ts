import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';
import { getDomainsAndLOs, showDomainsDittofi } from 'src/app/shared/static_data/apiURL';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreateQuestionServiceService {
  SelectedSubject = undefined;
  SelectedClass = undefined;
  allClasses = [];
  allSubjects = [];
  selectedQuestion: any;
  oneQuestion: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthManagerService,
    private http: HttpClient
  ) {}


  showDomainsDittofi() {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());
    return new Promise((resolve, reject) => {
      return this.http
        .get(
          showDomainsDittofi(this.SelectedClass.code, this.SelectedSubject.code, 2),

          {
            headers: headers,
          }
        )
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }



}
