import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  getDepartments,
  getPositions,
  getEmployee,
  showDepsPerSchool,
  getPositionsDittofi,
  createDepsDittofi,
  createPosDittofi,
} from 'src/app/shared/static_data/apiURL';
import { AuthManagerService } from './auth-manager.service';
import { Department } from '../Models/Department';
import { Position } from '../Models/Position';

@Injectable({
  providedIn: 'root',
})
export class DepartmentManagerService {
  constructor(
    private http: HttpClient,
    private authService: AuthManagerService
  ) {}


  createDepDittofi(schoolId: string, name: string) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());

    const temp = {
      name: name,
      school_id: Number(schoolId)
    };
    return new Promise((resolve, reject) => {
      this.http
        .post(createDepsDittofi, temp, { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }



  getDepsDittofi(schoolId: string) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());

    return new Promise((resolve, reject) => {
      this.http
        .get(showDepsPerSchool(schoolId), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }





  createPositionDittofi(schoolId: string, name: string) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());

    const temp = {
      name: name,
      school_id: Number(schoolId)
    };
    return new Promise((resolve, reject) => {
      this.http
        .post(createPosDittofi, temp, { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }




  getPositionsDittofi(schoolId: string) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());

    return new Promise((resolve, reject) => {
      this.http
        .get(getPositionsDittofi(schoolId), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  assignEmployeeDepDittofi(
    schoolId: string,
    employeeId: string,
    departments: Department[]
  ) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());

    var deps = [];
    console.log(departments)
    for (let dep of departments) {
      deps.push({ departmentId: dep.id });
    }

    return new Promise((resolve, reject) => {
      this.http
        .patch(
          getEmployee(schoolId) + '/' + employeeId + '/assignDepartment',
          { departments: deps },
          {
            headers: headers,
          }
        )
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }


  assignEmployeePos(
    schoolId: string,
    employeeId: string,
    positions: Position[]
  ) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    const poss = [];
    for (let pos of positions) {
      poss.push({ positionId: pos.id });
    }

    return new Promise((resolve, reject) => {
      this.http
        .patch(
          getEmployee(schoolId) + '/' + employeeId + '/assignPosition',
          { positions: poss },
          {
            headers: headers,
          }
        )
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
}
