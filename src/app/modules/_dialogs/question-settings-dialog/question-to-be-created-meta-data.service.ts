import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getDomainsAndLOs } from 'src/app/shared/static_data/apiURL';
import { AuthManagerService } from '../../_services/auth-manager.service';
import { CreateQuestionServiceService } from '../../_services/create-question-service.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionToBeCreatedMetaDataService {
  constructor(
    private createQuestion: CreateQuestionServiceService,
    private http: HttpClient,
    private authService: AuthManagerService
  ) {}

  ngOnInit() {
    console.log(this.createQuestion.SelectedClass);
    console.log(this.createQuestion.SelectedSubject);
  }
  getDomainsAndLOs() {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());
    return this.http
      .patch(
        getDomainsAndLOs(),
        {},
        {
          headers: headers,
        }
      )
      .toPromise()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
