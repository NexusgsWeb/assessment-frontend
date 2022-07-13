import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  createStudentURL,
  GetAllStudentsForSchoolURL,
  getStudentByIDURL,
  getStudentSubjects,
  view_students,
  student_by_id,
  createStudentURLDittofi,
} from 'src/app/shared/static_data/apiURL';
import { AuthManagerService } from './auth-manager.service';

@Injectable({
  providedIn: 'root',
})
export class StudentManagerService {
  constructor(
    private http: HttpClient,
    private authService: AuthManagerService
  ) {}


  CreateStudentDittofi(Student, school_id) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());

      console.log(school_id)
      console.log(Student)

    return new Promise((resolve, reject) => {
      this.http
        .post(createStudentURLDittofi(school_id), Student, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }


  getStudentByIDDittofi(school_id, student_id) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());
    return new Promise((resolve, reject) => {
      this.http
        .get(student_by_id(student_id, school_id), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  GetAllStudentsForSchoolDittofi(school_id) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
    return new Promise((resolve, reject) => {
      this.http
        .get(view_students(school_id), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  getStudentSubjects(studentId){
    const headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Authorization', this.authService.getUserToken());
  return new Promise((resolve, reject) => {
    this.http
      .get(getStudentSubjects(studentId), {
        headers: headers,
      })
      .toPromise()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });

  }
}
