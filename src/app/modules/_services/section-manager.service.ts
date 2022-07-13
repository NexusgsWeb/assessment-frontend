import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  createSection,
  getSectionsOfACAYURL,
  showSectionsDittofi,
  createSectionDittofi,
} from 'src/app/shared/static_data/apiURL';
import { Section } from '../Models/Section';
import { AuthManagerService } from './auth-manager.service';

@Injectable({
  providedIn: 'root',
})
export class SectionManagerService {
  token: string;
  username: string;

  constructor(
    private http: HttpClient,
    private authService: AuthManagerService
  ) {}



  createSectionDittofi(schoolId, cayId: string, section: Section) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

      const body = {
        code: section.code,
        maxNumberOfStudents: 100,
        minNumberOfStudents: 1,
        school_id: schoolId,
        class_of_academic_year_id: cayId
      };

      this.http
        .post(createSectionDittofi, body, { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }


  getSectionsOfCAYDittofi(schoolId: string, cayId: string) {
    console.log('params: ')
    console.log(schoolId)
    console.log(cayId)
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());
      this.http
        .get(showSectionsDittofi(schoolId, cayId), { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }

}
