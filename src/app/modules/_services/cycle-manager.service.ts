import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAcademicYears, getCycles, getCyclesDittofi, delCycleDittofi, editCycleDittofi, createCycleDittofi } from 'src/app/shared/static_data/apiURL';
import { Cycle } from '../Models/Cycle';
import { AuthManagerService } from './auth-manager.service';

@Injectable({
  providedIn: 'root',
})
export class CycleManagerService {
  hello: string = 'hello';
  constructor(
    private http: HttpClient,
    private authService: AuthManagerService
  ) {}



  getCyclesDittofi(schoolId) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

      this.http
        .get(getCyclesDittofi(schoolId), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }


  delCycleDittofi(cycleId: string) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

      this.http
        .put(delCycleDittofi(cycleId), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }

    editCycleDittofi(schoolId, cycle: Cycle) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

      const body = {
        name: cycle.name,
        code: cycle.name,
        school_id: 1
      };


      this.http
        .put(editCycleDittofi(cycle.id), body, { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }


  createCycleDittofi(schoolId, cycle: Cycle) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

      console.log(cycle.name);
      const body = {
        name: cycle.code,
        code: cycle.code,
        school_id: schoolId
      };

      this.http
        .post(createCycleDittofi, body, { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
}
