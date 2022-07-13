import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  deactivateActivateSchool,
  createSchool,
  createSchoolUsersURL,
  editSchoolURL,
  getSchool,
  deactivateActivateSchoolDittofi,
  addSchoolUser,
  editSchoolDittofi,
  createSchoolDittofi,
  showSchoolDittofi,
  destroySchoolDittofi,
} from 'src/app/shared/static_data/apiURL';
import { School } from '../Models/school';
import { AuthManagerService } from './auth-manager.service';

@Injectable({
  providedIn: 'root',
})
export class SchoolManagerService {
  constructor(
    private http: HttpClient,
    private authService: AuthManagerService
  ) {}

  getCurrentSchoolID() {
    //THIS ONLYYY WORKS on a user else it returns null
    try {
      if (
        JSON.parse(localStorage.getItem(this.authService.ADMIN_TOKEN_NAME)) ===
        null
      ) {
        if (
          sessionStorage.getItem(this.authService.ADMIN_TOKEN_NAME) !== null
        ) {
          if (this.authService.CheckIfAuthenticatedAdmin) {
            let JWTObject: any = JSON.parse(
              sessionStorage.getItem(this.authService.ADMIN_TOKEN_NAME)
            );
            return 1 + '';
            // return JWTObject.user.role[0].schoolId;
          }
        }
      } else {
        sessionStorage.removeItem(this.authService.ADMIN_TOKEN_NAME);
        if (this.authService.CheckIfAuthenticatedAdmin) {
          let JWTObject: any = JSON.parse(
            localStorage.getItem(this.authService.ADMIN_TOKEN_NAME)
          );
          return 1 + '';
          // return JWTObject.user.role[0].schoolId;
        }
      }
      return 1 + '';
      // return null;
    } catch (err) {
      return 1 + '';
      // return null;
    }
  }

  DeactivateActivateSchoolDittofi(school_id, ToActivate) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());

    const params = new HttpParams().set('activate', ToActivate);

    return new Promise((resolve, reject) => {
      this.http
        .patch(deactivateActivateSchoolDittofi(school_id, ToActivate), null, {
          headers: headers,
          params: params,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }


  CreateSchoolUsersDittofi(school_id) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());

    return new Promise((resolve, reject) => {
      this.http
        .get(addSchoolUser(school_id), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }


  editSchoolDittofi(school: School) {
    const {
      id,
      organization_id,
      license_number,
      is_active,
      created_at,
      image_uploaded,
      updated_at,
      ...rest
    } = school;
    const projectedObject = rest;
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    let promise = new Promise((resolve, reject) => {
      this.http
        .put(editSchoolDittofi(school.id), projectedObject, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
    return promise;
  }


  createSchoolDittofi(school: School) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());

      let d = new Date(school.license_expiration_date)
      let led = d.toISOString();
      console.log(led)
      console.log(this.authService.getUserId())

    const temp = {
      organization_id: school.organization_id,
      english_name: school.english_name,
      arabic_name: school.arabic_name,
      code: school.code,
      school_url: school.school_url,
      address: school.address,
      logo: school.logo,
      mobile: school.mobile,
      phone1: school.phone1,
      phone2: school.phone2,
      email: school.email,
      website: school.website,
      license_number: Number(school.license_number),
      license_type: school.license_type,
      license_expiration_date: led,
      created_by: this.authService.getUserId()
    };

    return new Promise((resolve, reject) => {
      this.http
        .post(createSchoolDittofi, temp, { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }


  getSchoolByIDDittofi(schoolId) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    return new Promise((resolve, reject) => {
      this.http
        .get(showSchoolDittofi(schoolId), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  deleteSchoolDittofi(schoolId: string) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    return new Promise((resolve, reject) => {
      this.http
        .delete(destroySchoolDittofi(schoolId), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
}
