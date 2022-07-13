import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  createStudentURL,
  deactivateActivateOrganization,
  getStudentByIDURL,
  getEmployee,
  getEmployeeByIDURL,
  getEmployeeDittofi,
  getEployeeByIdDittofi,
  createEmployeeDittofi,
} from 'src/app/shared/static_data/apiURL';
import { Student } from '../Models/Student';
import { AuthManagerService } from './auth-manager.service';
import { Employee } from '../Models/Employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeManagerService {
  constructor(
    private http: HttpClient,
    private authService: AuthManagerService
  ) {}


  createEmployeeDittofi(schoolId: string, employee: Employee, departments: any[], positions: any[]) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());

      console.log(departments)
      console.log(positions)
    const temp = {
      employeeNumber: employee.employee_number,
      firstName: employee.first_name,
      lastName: employee.last_name,
      middleName: employee.middle_name,
      arabicFirstName: employee.arabic_first_name,
      arabicLastName: employee.arabic_last_name,
      arabicMiddleName: employee.arabic_middle_name,
      email: employee.email,
      dateOfBirth: employee.date_of_birth,
      password: employee.password,
      phoneNumber: employee.phone_number,
      mobileNumber: employee.mobile_number,
      placeOfBirth: employee.place_of_borth,
      religion: 'test',
      bloodType: 'test',
      logoName: employee.logoName,
      userGender: employee.user_gender,
      contactDetails: employee.contactDetails,
      nationalities: employee.nationalities,
      joinDate: employee.joinDate,
      school_id: Number(schoolId),
      departments: departments,
      positions: positions
    };

    console.log(temp)
    return new Promise((resolve, reject) => {
      this.http
        .post(createEmployeeDittofi, temp, { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }


  GetAllEmployeesDittofi(school_id) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());
    return new Promise((resolve, reject) => {
      this.http
        .get(getEmployeeDittofi(school_id), {
          headers: headers,
        })
        .toPromise()
        .then((res) => {
          console.log(res);
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }



  getEmployeeByIDDittofi(employee_id) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());
    return new Promise((resolve, reject) => {
      this.http
        .get(getEployeeByIdDittofi(employee_id), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

}
