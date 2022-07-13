import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  publishAssessment,
  createAssessment,
  assignQuestions,
  getAllAssessmentsURL,
  startAssessmentURL,
  getAssessmentByIDURL,
  StoreStudentsAnswersURL,
  getAssessmentResult,
  resetAssessment,
  studentAnswers,
  resumeExamURL,
  endExamURL,
  getLOs,
  getLOContent,
  wizenozeDittofi,
} from 'src/app/shared/static_data/apiURL';
import { AcademicYear } from '../Models/AcademicYear';
import { AuthManagerService } from './auth-manager.service';
import { Assessment } from '../Models/Assessment';
import { Section } from '../Models/Section';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WizenoseManagerService {

  content: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  constructor(
    private http: HttpClient,
    private authService: AuthManagerService
  ) {}

  getLOPerformance(los: any[]){

    const body = {
      "loIds":  los
    }
    console.log(body)

    const headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Authorization', this.authService.getUserToken());


  return new Promise((resolve, reject) => {
    this.http
      .patch(getLOContent, body, {
        headers: headers,
      })
      .toPromise()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });

}

getLOPerformanceDittofi(query, result_size, userType, userUUID){


  const headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Authorization', '107ff38c-6d23-432f-82d9-d7c992e9760b');


return new Promise((resolve, reject) => {
  this.http
    .get(wizenozeDittofi(query, result_size, userType, userUUID), {
      headers: headers,
    })
    .toPromise()
    .then((res) => resolve(res))
    .catch((err) => reject(err));
});

}
}
