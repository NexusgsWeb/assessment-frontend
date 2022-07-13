import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  publishAssessment,
  createAssessment,
  assignQuestions,
  getAllAssessmentsURL,
  startAssessmentURL,
  getAssessmentByIDURL,
  StoreStudentsAnswersURL,
  getAssessmentResult,
  resetAssessment,
  studentAnswers,
  resumeExamURL,
  endExamURL,
  getStudentResult,
  bulkDelAssessment,
  correctAssessment,
  getStudentResults,
  resumeExamDittofi,
  createAssessmentDittofi,
  assessmentAddQuestionsDittofi,
  startAssessmentDittofi,
  showAssessmentDittofi,
  storeAnswersDittofi,
  resetAssessmentDittofi,
  getStudentAnswersDittofi,
  destroyAssessmentDittofi,
  editAssessmentDittofi,
  adminsAssessmentDittofi,
  bulkDestroyAssessmentDittofi,
  correctAssessmentDittofi,
  getSubjectAssessments,
  getStudentAssessments,
  StoreStudentsAnswersURLDittofi,
  completeExamDittofi,
  publishAssessmentDittofi,
  getAssessmentsPerSection,
  getSectionStudents,
  getResultsPerStudentDittofi,
  viewStudentResultDittofi,
  getAssesmentStudentsDittofi,
  viewTeacherResultDittofi,
  gradeQuestionsDittofi,
  getAttemptsNumber,
  getAssessmentResults,
  publishResultsDittofi,
} from 'src/app/shared/static_data/apiURL';
import { AcademicYear } from '../Models/AcademicYear';
import { AuthManagerService } from './auth-manager.service';
import { Assessment } from '../Models/Assessment';
import { Section } from '../Models/Section';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssessmentManagerService {
  newAssessment$ = new BehaviorSubject<Assessment>(null);
  learningStandards$ = new BehaviorSubject<any>(null);
  selectedSections$ = new BehaviorSubject<any>(null);
  questions$ = new BehaviorSubject<any>(null);
  time$ = new BehaviorSubject<any>(null);
  editedAssessment$ = new BehaviorSubject<any>(null);
  results$ = new BehaviorSubject<any>(null);

  assessmentData$ = new BehaviorSubject<any>(null);
  viewAssessementsObject$ = new BehaviorSubject<any>(null);
  finishedAsst$ = new BehaviorSubject<boolean>(false);
  assessmentQuestionsAnswers$ = new BehaviorSubject<any>([]);

  answeredQuestions$ = new BehaviorSubject<any>([]);

  published$ = new BehaviorSubject<boolean>(true);

  constructor(
    private http: HttpClient,
    private authService: AuthManagerService
  ) {}


  getSubjectAssessmentsDittofi(subject_id) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

        this.http
          .get(getSubjectAssessments(subject_id), {
            headers: headers,
          })
          .toPromise()
          .then((res) => resolve(res))
          .catch((res) => reject(res));

    });
  }

  getSectionStudentsDittofi(id) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

        this.http
          .get(getSectionStudents(id), {
            headers: headers,
          })
          .toPromise()
          .then((res) => resolve(res))
          .catch((res) => reject(res));

    });
  }
  getAssessmentsPerSectionDittofi(subject_id, section_id) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

        this.http
          .get(getAssessmentsPerSection(subject_id, section_id), {
            headers: headers,
          })
          .toPromise()
          .then((res) => resolve(res))
          .catch((res) => reject(res));

    });
  }


  resumeExamDittofi(assessmentID, studentID) {
    console.log(assessmentID)
    console.log(studentID)
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());
    return new Promise((resolve, reject) => {
      this.http
        .get(resumeExamDittofi(assessmentID, studentID), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  //TODO later
  publishAssessmentDittofi(assessmentId: string, checked: boolean) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());

    const params = new HttpParams().set('publish', checked);

    return new Promise((resolve, reject) => {
      this.http
        .put(publishAssessmentDittofi(assessmentId), {publish: checked}, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }



  createAssessmentDittofi(assessment: any, sections: any[]) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());
      const sectionsSelected = [];
      console.log(sections)
      for (let sec of sections) {
        sectionsSelected.push({ id: sec.Id });
      }

      console.log(sectionsSelected);

      const body = {
        title: assessment.title,
        instructions: assessment.instruction,
        subject_id: assessment.subjectID,
        sections: sectionsSelected,
        duration: Number(assessment.testDurationInMinuets),
        from_date: assessment.startDate,
        to_date: assessment.endDate,
        random_order: assessment.random
      };
      this.http
        .post(createAssessmentDittofi, body, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }



  assignQuestionsToAssessmentDittofi(assessmentId: string, questions: any[], random: boolean) {
    //4e148965-4c2a-40b7-9439-c77e111a4c2c
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

      console.log(questions);
      const q = [];
      for (let i = 0; i < questions.length; i++) {
        const obj = {
          questionId: questions[i].cur_ques_id,
          questionOrder: i,
          mark: questions[i].mark,
        };
        q.push(obj);
      }
      console.log(questions);

      const body = {
        randomOrder: random,
        questions: q,
      };

      console.log(body);

      this.http
        .post(assessmentAddQuestionsDittofi(assessmentId), body, { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }

  startAssessmentAndGetQuestionsDittofi(assessmentID, studentId) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());
    return new Promise((resolve, reject) => {
      this.http
        .get(startAssessmentDittofi(assessmentID, studentId), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

   // getAssessmentByIDURL
   getSpecificAssessmentDittofi(assessmentID) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());
    return new Promise((resolve, reject) => {
      this.http
        .get(showAssessmentDittofi(assessmentID), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  SubmitStudentQuestionDittofi(AssessmentID, payload) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());

      console.log(payload)
    return new Promise((resolve, reject) => {
      this.http
        .post(StoreStudentsAnswersURLDittofi(AssessmentID), payload, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }


  endAssessmentDittofi(assessmentId, student_id) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());
    return new Promise((resolve, reject) => {
      this.http
        .put(completeExamDittofi(assessmentId, student_id), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }



  getAssessmentResults(assessmentId) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());
    return new Promise((resolve, reject) => {
      this.http
        .get(getAssessmentResult(assessmentId), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
  getAssessmentResultsDittofi(assessmentId) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());
      console.log(getAssesmentStudentsDittofi(assessmentId))
    return new Promise((resolve, reject) => {
      this.http
        .get(getAssesmentStudentsDittofi(assessmentId), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }


  getSystemTime() {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          'https://7t8xqn3z95.execute-api.eu-west-1.amazonaws.com/dev/v1.0/sysTime'
        )
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }



  getStudentAssessmentsPerSubjectDittofi(id, schoolId, sectionId) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

        console.log(this.authService.getUserId())

        console.log(id)
        console.log(schoolId)
        console.log(sectionId)

      this.http
        .get(getStudentAssessments(id, schoolId, sectionId), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }


  resetAssessmentDittofi(assessmentId: string, studentId: boolean) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());

    return new Promise((resolve, reject) => {
      this.http
        .put(resetAssessmentDittofi(assessmentId, studentId), null, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }


  getStudentAnswersDittofi(assessmentId, studentId) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

      this.http
        .get(getStudentAnswersDittofi(assessmentId, studentId), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }


  deleteAssessmentDittofi(assessmentId, user_id) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

      this.http
        .put(destroyAssessmentDittofi(assessmentId, user_id), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }


  editAssessmentDittofi(assessment: Assessment, sections: Section[]){
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());
      const sectionsSelected = [];
      for (let sec of sections) {
        sectionsSelected.push({ id: sec.id });
      }

      console.log(sectionsSelected);

      const body = {
        title: assessment.title,
        instruction: assessment.instruction,
        subjectID: assessment.subjectID,
        sections: sectionsSelected,
        testDurationInMinuets: Number(assessment.testDurationInMinuets),
        startsAtDateTime: assessment.startDate,
        endsAtDateTime: assessment.endDate,
      };
      this.http
        .put(editAssessmentDittofi(assessment.id), body, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }


  getAdminAssesmentsBySubject(subjectId){
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

        const params = new HttpParams().set('subjectId', subjectId);

        this.http
          .get(adminsAssessmentDittofi(subjectId), {
            headers: headers,
            params: params,
          })
          .toPromise()
          .then((res) => resolve(res))
          .catch((res) => reject(res));

    });
  }
  getStudentResults(assessmentId, studentId){
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());


        this.http
          .get(getStudentResult(assessmentId, studentId), {
            headers: headers,
          })
          .toPromise()
          .then((res) => resolve(res))
          .catch((res) => reject(res));

    });
  }


  bulkDeleteDittofi(assessments){
    let ids = []
    for(let asst of assessments){
      ids.push(asst.id);
    }
    console.log(ids)

    const headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Authorization', this.authService.getUserToken());

    const options = {
      headers: headers,
      body: {
        ids: ids,
      },
    };

    return new Promise((resolve, reject) => {


      this.http
        .delete(bulkDestroyAssessmentDittofi, options)
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }



  correctAssessmentDittofi(assessmentId, student_id){
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());


    return new Promise((resolve, reject) => {
      this.http
        .patch(correctAssessmentDittofi(assessmentId, student_id), null, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });

}

  getResultsPerStudent(subjectId, studentId){
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());


        this.http
          .get(getStudentResults(subjectId, studentId), {
            headers: headers,
          })
          .toPromise()
          .then((res) => resolve(res))
          .catch((res) => reject(res));

    });
  }

  getResultsPerStudentDittofi(id, subjectId){
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

        console.log(getResultsPerStudentDittofi(id, subjectId))

        this.http
          .get(getResultsPerStudentDittofi(id, subjectId), {
            headers: headers,
          })
          .toPromise()
          .then((res) => resolve(res))
          .catch((res) => reject(res));

    });
  }

  viewStudentResultDittofi(assessment_id, id){
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());


        this.http
          .get(viewStudentResultDittofi(assessment_id, id), {
            headers: headers,
          })
          .toPromise()
          .then((res) => resolve(res))
          .catch((res) => reject(res));

    });
  }

  viewTeacherResultDittofi(assessment_id, id){
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

        console.log(viewTeacherResultDittofi(assessment_id, id))

        this.http
          .get(viewTeacherResultDittofi(assessment_id, id), {
            headers: headers,
          })
          .toPromise()
          .then((res) => resolve(res))
          .catch((res) => reject(res));

    });
  }

  gradeQuestionsDittofi(student_id, assessment_id, answer_id, mark) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getUserToken());


    return new Promise((resolve, reject) => {
      this.http
        .put(gradeQuestionsDittofi(student_id, assessment_id, answer_id, mark), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }


  getAttemptsNumberDittofi(assessment_id, student_id){
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

        console.log(getAttemptsNumber(assessment_id, student_id))

        this.http
          .get(getAttemptsNumber(assessment_id, student_id), {
            headers: headers,
          })
          .toPromise()
          .then((res) => resolve(res))
          .catch((res) => reject(res));

    });
  }



  getAssessmentResDittofi(assessment_id){
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

        console.log(getAssessmentResults(assessment_id))

        this.http
          .get(getAssessmentResults(assessment_id), {
            headers: headers,
          })
          .toPromise()
          .then((res) => resolve(res))
          .catch((res) => reject(res));

    });
  }



  publishResultsDittofi(assessment_id, publish){
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authService.getUserToken());

        console.log(publishResultsDittofi(assessment_id, publish))

        this.http
          .put(publishResultsDittofi(assessment_id, publish), {
            headers: headers,
          })
          .toPromise()
          .then((res) => resolve(res))
          .catch((res) => reject(res));

    });
  }
}
