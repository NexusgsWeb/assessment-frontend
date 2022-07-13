import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getYearClasses, createCAYDittofi, getCAYDittofi, getAllCAYDittofi } from 'src/app/shared/static_data/apiURL';
import { AcademicClass } from '../Models/AcademicClass';
import { AuthManagerService } from './auth-manager.service';

@Injectable({
  providedIn: 'root',
})
export class AcademicClassService {
  constructor(
    private http: HttpClient,
    private authService: AuthManagerService
  ) {}


  createCAYDittofi(
    academicClass: AcademicClass,
    academicYearId: string
  ) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

      const body = {
        name: academicClass.name,
        academic_year_id: academicYearId,
        second_language_name: academicClass.second_language_name,
        code: academicClass.code,
        //STATICCCCCCCCCCC
        class_id: 2,
        class_order: 1,
        cycle_id: academicClass.Cycle.id,
        school_id: 1
      };

      console.log(body)
      this.http
        .post(createCAYDittofi, body, { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }


  getCAYDittofi(cay_id) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());
    return new Promise((resolve, reject) => {
      this.http
        .get(getCAYDittofi(cay_id), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }

  getAllCAYDittofi(school_id) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());
    return new Promise((resolve, reject) => {
      this.http
        .get(getAllCAYDittofi(school_id), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }

}
