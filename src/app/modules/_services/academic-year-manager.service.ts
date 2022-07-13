import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  getAcademicYears,
  getOrganizationsURL,
  deleteAcademicYearURL,
  activateAcademicYear,
  showAcademicYearsDittofi,
  destroyAcademicYearDittofi,
  createAcademicYearDittofi,
  activateAcademicYearDittofi,
  editAcademicYearDittofi,
} from 'src/app/shared/static_data/apiURL';
import { AcademicYear } from '../Models/AcademicYear';
import { AuthManagerService } from './auth-manager.service';

@Injectable({
  providedIn: 'root',
})
export class AcademicYearManagerService {
  constructor(
    private http: HttpClient,
    private authService: AuthManagerService
  ) {}



  getAllAcademicYearsDittofi(schoolId) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

      console.log(showAcademicYearsDittofi(schoolId));
      this.http
        .get(showAcademicYearsDittofi(schoolId), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }



  deleteAcademicYearDittofi(academicYear: AcademicYear) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
      this.http
        .put(destroyAcademicYearDittofi(academicYear.id, this.authService.getUserId()), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }




  createNewAcademicYearDittofi(academicYear: AcademicYear, school_id) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json');

        let start = new Date(academicYear.start_date).toISOString();
        let end = new Date(academicYear.end_date).toISOString();

      const body = {
        name: academicYear.name,
        code: academicYear.code,
        startDate: start,
        endDate: end,
        is_active: true
      };


      this.http
        .post(createAcademicYearDittofi(school_id), body, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res));
    });
  }




  activateDeactivateAcademicYearDittofi(
    academicId: string,
    checked: boolean
  ) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json');

    return new Promise((resolve, reject) => {
      this.http
        .put(activateAcademicYearDittofi(academicId, checked), null, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  editAcademicYearDittofi(academicYear: AcademicYear, schoolId) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());

    console.log(academicYear);
    const body = {
      name: academicYear.name,
      code: academicYear.code,
      startDate: academicYear.start_date,
      endDate: academicYear.end_date,
    };

    return new Promise((resolve, reject) => {
      this.http
        .put(editAcademicYearDittofi(academicYear), body, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

}
