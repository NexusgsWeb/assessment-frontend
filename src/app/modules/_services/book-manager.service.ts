import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthManagerService } from './auth-manager.service';
import { getBooks, getBook, getUnits, filter, getBooksDittofi, getUnitsDittofi, getBookChapters, getChapterSections, filterDittofi } from 'src/app/shared/static_data/apiURL';
import { ChapterSection } from '../Models/ChapterSection';


@Injectable({
  providedIn: 'root',
})
export class BookManagerService {
  constructor(
    private http: HttpClient,
    private authService: AuthManagerService
  ) {}


  getAllBooksDittofi(gradeCode, subjectCode){

    const body = {
      gradeCode: gradeCode,
      subjectCode: subjectCode
    }

    console.log(body)

    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    console.log;
    return new Promise((resolve, reject) => {
      this.http
        .get(getBooksDittofi(gradeCode, subjectCode), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }


  getBookChaptersDittofi(bookId: string){
    return new Promise((resolve, reject) => {
        const headers = new HttpHeaders()
          .set('content-type', 'application/json')
          .set('Authorization', this.authService.getUserToken());

          console.log(getBookChapters(bookId))
        this.http
          .get(getBookChapters(bookId), {
            headers: headers,
          })
          .toPromise()
          .then((res) => resolve(res))
          .catch((res) => reject(res));
      });
  }



  getChapterSectionDittofi(chapterId: string){
    return new Promise((resolve, reject) => {
        const headers = new HttpHeaders()
          .set('content-type', 'application/json')
          .set('Authorization', this.authService.getUserToken());

        this.http
          .get(getChapterSections(chapterId), {
            headers: headers,
          })
          .toPromise()
          .then((res) => resolve(res))
          .catch((res) => reject(res));
      });
  }



  getUnitsDittofi(gradeCode, subjectCode, curriculum_id){
    const body = {
      gradeCode: gradeCode,
      subjectCode: subjectCode
    }

    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

      this.http
        .get(getUnitsDittofi(gradeCode, subjectCode, curriculum_id),{
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }



  getQuestionsFilterDittofi(bookIds: string[], chapterIds: string[], sectionIds: string[], unitIds: string[],
    learningObjectiveIds: string[], learningStandardsIds: string[], domainIds: string[]){
    const headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Authorization', this.authService.getToken());

    const body: any = {};



    if(bookIds.length > 0){
      body.bookIds = bookIds.toString();
    }
    if(chapterIds.length > 0){
      body.chapterIds = chapterIds.toString()
    }
    if(sectionIds.length > 0){
      body.sectionIds = sectionIds.toString()
    }
    if(unitIds.length > 0){
      body.unitIds = unitIds.toString()
    }
    if(learningObjectiveIds.length > 0){
      body.learningObjectiveIds = learningObjectiveIds.toString()
    }
    if(learningStandardsIds.length > 0){
      body.learningStandardIds = learningStandardsIds.toString()
    }

    console.log(body);
    console.log(filterDittofi)
  return new Promise((resolve, reject) => {
    this.http
      .post(
        filterDittofi,
        body,
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
