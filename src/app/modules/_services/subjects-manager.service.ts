import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  delSubjects,
  getSubjects,
  createSubjects,
  createSection,
  getClasses,
  editSubjects,
  assignSubjects,
  getSectionSubjects,
  getSubjectNames,
  getAllClassesDittofi,
  getClassSubjectsDittofi,
  getSectionSubjectsDittofi,
  deleteSubjectDittofi,
  createSubjectDittofi,
  editSubjectDittofi,
  assignSubjectToEmployeeDittofi,
  getClassSectionsDittofi,
  getClassSubjectsAssessment,
  getAdminClasses,
  getSuperAdminClasses,
  superAdminClasses,
  getStudentSubjectsDittofi,
} from 'src/app/shared/static_data/apiURL';
import { Subject } from '../Models/Subject';
import { AuthManagerService } from './auth-manager.service';
import { SchoolManagerService } from './school-manager.service';
import { School } from '../Models/school';

@Injectable({
  providedIn: 'root',
})
export class SubjectsManagerService {
  constructor(
    private http: HttpClient,
    private schoolService: SchoolManagerService,
    private authService: AuthManagerService
  ) {}

  getAllClassesDittofi(id) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());
      this.http
        .get(getAllClassesDittofi(id), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }
  getClassSubjectsAssessment(id) {
    console.log('grades: ')
    console.log(id)
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());
      this.http
        .get(getClassSubjectsAssessment(id), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }


  getSubjectsNameBulkDittofi(IDs) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

      this.http
        .patch(
          getSubjectNames(this.schoolService.getCurrentSchoolID()),
          {
            ids: IDs,
          },
          {
            headers: headers,
          }
        )
        .toPromise()
        .then((res: any) => resolve(res.subjects))
        .catch((res) => reject(res));
    });
  }


  getClassSubjectsDittofi(schoolId: string, classId: string) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

      console.log(getClassSubjectsDittofi(schoolId, classId));
      this.http
        .get(getClassSubjectsDittofi(schoolId, classId), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }

  getSectionSubjectsDittofi(schoolId: string, sectionId: string) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

      console.log(getSectionSubjectsDittofi(schoolId, sectionId));
      this.http
        .get(getSectionSubjects(schoolId, sectionId), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }

  deleteSubjectDittofi(subject: Subject) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

      this.http
        .put(deleteSubjectDittofi(subject.id), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }
   createSubjectDittofi(schoolId: string, subject: Subject, orders: any) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

        console.log(orders)
      const tempSections = [];
      for (let value of orders.values()) {
        for (let v of value) {
          console.log(v.order);
          tempSections.push({
            id: v.sec.Id,
            subject_order: v.order,
          });
        }
      }

      console.log(tempSections);

      const body = {
        name: subject.name,
        code: subject.code,
        section_ids: tempSections,
        school_id: Number(schoolId)
      };

      console.log(body);
      this.http
        .post(createSubjectDittofi, body, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }

  getClassSectionsDittofi(schoolId, classId: string) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json');
      this.http
        .get(getClassSectionsDittofi(schoolId, classId), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }


  editSubjectsDittofi(subject) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());

    const body = {
      name: subject.name,
      code: subject.code,
      subject_order: subject.subject_order,
    };
    console.log(body);

    return new Promise((resolve, reject) => {
      this.http
        .put(editSubjectDittofi(subject.id), body, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }


  assignSubjectToEmployeeDittofi(SchoolID, EmployeeID, Subject_ID, Section_ID) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

      const body = {
        subject_id: Subject_ID,
        section_id: Section_ID,
        school_id: Number(SchoolID),
        employee_id: EmployeeID,
        role: 'teacher'
      };

      this.http
        .post(assignSubjectToEmployeeDittofi, body, { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }

  getSubjectName(schoolId, subjectId){

    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());
      this.http
        .get(delSubjects(schoolId, subjectId), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });

  }


  getAdminClassesDittofi(schoolId) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());
      this.http
        .get(getAdminClasses(schoolId), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }

  getSuperAdminClassesDittofi(curriculumId){

    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());
      this.http
        .get(superAdminClasses(curriculumId), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }
  getStudentSubjectsDittofi(sectionId){

    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());
      this.http
        .get(getStudentSubjectsDittofi(sectionId), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }
}
