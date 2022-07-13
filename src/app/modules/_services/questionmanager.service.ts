import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  addMetaDataForQuestionsURL,
  ApproveQuestionURL,
  createQuestionURL,
  getAllQuestionsURL,
  PublishUnPublishURL,
  getDomainsByCurriculumURL,
  getLOs,
  answerFeedback,
  getSuperAdminCurriculum,
  questionChanges,
  deleteQuestion,
  getQuestionByIdURL,
  editQuestionURL,
  getTeacherQuestions,
  createQuestionURLV2,
  get_admin_metadata,
  adminQuestionsDittofi,
  getCurriculumDomainsDittofi,
  getDomainLOsDittofi,
  destroyUserDittofi,
  question_showOne,
  teacher_questions,
  createQuestionDittofi,
  PublishUnPublishURLDittofi,
  editQuestionDittofi,
  getQuestionAnswers,
  createCQ,
  migrate_questions,
  migrate_answers,
  getGrades,
  updateDomain,
  questionById,
  approveQ,
  awaitApproval,
  getUnsavedLS,
  saveQuestionDittofiLebanese,
  saveQuestionDittofiAmerican,
  saveQuestionDittofiBritish,
  addFeedbackDittofi,
} from 'src/app/shared/static_data/apiURL';
import { question } from '../Models/question';
import { AuthManagerService } from './auth-manager.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionmanagerService {


  constructor(
    private authService: AuthManagerService,
    private http: HttpClient
  ) {}




  deleteQuestionDittofi(QuestionID) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')

    return new Promise((resolve, reject) => {
      this.http
        .put(destroyUserDittofi(this.authService.getUserId(), QuestionID), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }


  publishUnPublishQuestionDittofi(questionID, ToPublish) {
    const params = new HttpParams().set('publish', ToPublish);

    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    console.log;
    return new Promise((resolve, reject) => {
      this.http
        .put(PublishUnPublishURLDittofi(questionID), params, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }



  createQuestionV2Dittofi(Question: question, metadata, userId) {
    console.log(Question)
    console.log(metadata)

    let los = [];
    for(let lo of metadata.loMap){
      los.push({id: lo.lo.id})
    }
    let finalData = {
      question_text: Question.questionText,
      answer_key: metadata.answerKey,
      // starting_page_number:0,
      // ending_page_number:0,
      // book_id:0,
      status: 'pending',
      answers: Question.answers,
      blooms_taxonomy_id: metadata.bloomsTaxonomyId,
      curriculum_id: metadata.curriculumId,
      grade_code: metadata.gradeCode,
      subject_code: metadata.subjectCode,
      learning_objective_ids: los,
      question_type: Question.questionType,
      created_by: userId
    }
    console.log(finalData)
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    console.log;
    return new Promise((resolve, reject) => {
      this.http
        .post(createQuestionDittofi, finalData, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }


  getQuestionByIDDittofi(QuestionID) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    console.log;
    return new Promise((resolve, reject) => {
      this.http
        .get(question_showOne(QuestionID), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  getQuestionAnswersDittofi(questionId){
    const headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Authorization', this.authService.getToken());
  console.log;
  return new Promise((resolve, reject) => {
    this.http
      .get(getQuestionAnswers(questionId), {
        headers: headers,
      })
      .toPromise()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
  }



  setQuestionMetaDataLebaneseDittofi(QuestionID, MetaData) {
    let tempLO = []
    console.log(MetaData)
    for(let lo of MetaData.learningObjectiveIds){
      tempLO.push({id: Number(lo)});
    }

    let metaDataFinal = {
      blooms_taxonomy_id: MetaData.bloomsTaxonomyId,
      curriculum_id: MetaData.curriculumId,
      grade_code: MetaData.gradeCode,
      learning_objective_id: tempLO,
      subject_code: MetaData.subjectCode
    }

    console.log(QuestionID)
    console.log(metaDataFinal)

    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    return new Promise((resolve, reject) => {
      this.http
        .post(saveQuestionDittofiLebanese(QuestionID), metaDataFinal, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  setQuestionMetaDataAmericanDittofi(QuestionID, MetaData) {
    let tempLO = []
    console.log(MetaData)
    for(let lo of MetaData.learningObjectiveIds){
      tempLO.push({id: Number(lo)});
    }

    let metaDataFinal = {
      blooms_taxonomy_id: MetaData.bloomsTaxonomyId,
      curriculum_id: MetaData.curriculumId,
      grade_code: MetaData.gradeCode,
      learning_objective_id: tempLO,
      subject_code: MetaData.subjectCode
    }

    console.log(QuestionID)
    console.log(metaDataFinal)

    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    console.log;
    return new Promise((resolve, reject) => {
      this.http
        .post(saveQuestionDittofiAmerican(QuestionID), metaDataFinal, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  setQuestionMetaDataBritishDittofi(QuestionID, MetaData) {
    let tempLO = []
    console.log(MetaData)
    for(let lo of MetaData.learningObjectiveIds){
      tempLO.push({id: Number(lo)});
    }

    let metaDataFinal = {
      blooms_taxonomy_id: MetaData.bloomsTaxonomyId,
      curriculum_id: MetaData.curriculumId,
      grade_code: MetaData.gradeCode,
      learning_objective_id: tempLO,
      subject_code: MetaData.subjectCode
    }

    console.log(metaDataFinal)

    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    console.log;
    return new Promise((resolve, reject) => {
      this.http
        .post(saveQuestionDittofiBritish(QuestionID), metaDataFinal, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }



  approveQuestionDittofi(QuestionID) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    console.log;
    return new Promise((resolve, reject) => {
      this.http
        .put(approveQ(QuestionID), null, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }





  getCurriculumDomainsDittofi(curriculumId, grade) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    return new Promise((resolve, reject) => {

      this.http
        .get(getCurriculumDomainsDittofi(curriculumId, grade), {
          headers: headers,
        })

        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }



  getLObyDomainDittofi(curriculumId, gradeCode, domainId) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());


    return new Promise((resolve, reject) => {
      this.http
        .get(getDomainLOsDittofi(curriculumId, gradeCode, domainId), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }



  // addAnswerFeedback(student_id, assessment_id, answer_id, feedback) {

  //   const headers = new HttpHeaders()
  //     .set('content-type', 'application/json')
  //     .set('Authorization', this.authService.getToken());
  //   console.log;
  //   return new Promise((resolve, reject) => {
  //     this.http
  //       .put(addFeedbackDittofi(student_id, assessment_id, answer_id, feedback), {
  //         headers: headers,
  //       })
  //       .toPromise()
  //       .then((res) => resolve(res))
  //       .catch((err) => reject(err));
  //   });
  // }

  addFeedbackDittofi(student_id, assessment_id, answer_id, feedback) {

    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    console.log(addFeedbackDittofi(student_id, assessment_id, answer_id, feedback));
    return new Promise((resolve, reject) => {
      this.http
        .put(addFeedbackDittofi(student_id, assessment_id, answer_id, feedback), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }



  getSuperAdminCurriculumDittofi() {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    return new Promise((resolve, reject) => {
      this.http
        .get(get_admin_metadata, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }


  editQuestionDittofi(QuestionID, newQuestion, metadata) {
    let answers = [];
    console.log('question details')
    console.log(QuestionID)
    console.log(newQuestion)
    console.log(metadata)

    for(let ans of newQuestion.answers){
      let tempAnswer = {answerText: ans.answerText, isCorrect: ans.isCorrect}
      answers.push(tempAnswer)
    }
    newQuestion.answers = answers
    let los = [];
    if(metadata.loMap != undefined){
      for(let lo of metadata.loMap){
        los.push({id: lo.lo.id})
      }
    }

    let finalData = {
      question_text: newQuestion.questionText,
      answer_key: metadata.answerKey,
      // starting_page_number:0,
      // ending_page_number:0,
      // book_id:0,
      answers: newQuestion.answers,
      blooms_taxonomy_id: metadata.bloomsTaxonomyId,
      curriculum_id: metadata.curriculumId,
      grade_code: metadata.gradeCode,
      subject_code: metadata.subjectCode,
      learning_objective_ids: los,
      question_type: newQuestion.questionType,
      lo_length: los.length
    }
    console.log(finalData)

    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());

    return new Promise((resolve, reject) => {
      this.http
        .put(editQuestionDittofi(QuestionID), finalData, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }




  getAdminFilterQuestionsDittofi(subjectCode, page, size, query, filters) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
      console.log(query)
      console.log(filters)
      if(filters.curriculumId.length == 0){
        filters.curriculumId = 0
      }
      if(filters.domainId.length == 0){
        filters.domainId = 0
      }
      if(filters.learningObjectiveId.length == 0){
        filters.learningObjectiveId = 0
      }
      console.log(filters)

    return new Promise((resolve, reject) => {
      this.http
        .get(adminQuestionsDittofi(subjectCode, (page + 1), size, filters.curriculumId, filters.gradeCode,
          filters.domainId, filters.learningObjectiveId, filters.status, query), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }



  getTeacherSearchQuestionsDittofi(subjectCode, gradeCode, page, size, query, curriculum) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    // const params = new HttpParams()
    //   .set('subjectCode', subjectCode)
    //   .set('gradeCode', gradeCode)
    //   .set('page', page)
    //   .set('size', size)
    //   .set('query', query);

    console.log(gradeCode)
    console.log(subjectCode)
    console.log(page)
    console.log(size)
    console.log(query)
    console.log(curriculum)
    return new Promise((resolve, reject) => {
      this.http
        .get(teacher_questions(gradeCode, subjectCode, size, page, query, curriculum), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }



  createCQdittofi(id, body) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    console.log;
    return new Promise((resolve, reject) => {
      this.http
        .post(createCQ(id), body, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  migrateQuestions(body) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    console.log;
    console.log(body);
    return new Promise((resolve, reject) => {
      this.http
        .post(migrate_questions, body, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  migrateAnswers(body) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    return new Promise((resolve, reject) => {
      this.http
        .post(migrate_answers, body, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  // getGrades(gradeCode, subjectCode, curriculum) {

  //   const headers = new HttpHeaders()
  //     .set('content-type', 'application/json')
  //   console.log;
  //   return new Promise((resolve, reject) => {
  //     this.http
  //       .get(getGrades(gradeCode, subjectCode, curriculum), {
  //         headers: headers,
  //       })
  //       .toPromise()
  //       .then((res) => resolve(res))
  //       .catch((err) => reject(err));
  //   });
  // }

  // updateDomain(id, grade) {
  //   const headers = new HttpHeaders()
  //     .set('content-type', 'application/json')
  //     .set('Authorization', this.authService.getToken());
  //   console.log;
  //   return new Promise((resolve, reject) => {
  //     this.http
  //       .post(updateDomain(id, grade), {
  //         headers: headers,
  //       })
  //       .toPromise()
  //       .then((res) => resolve(res))
  //       .catch((err) => reject(err));
  //   });
  // }

  previewQuestionDittofi(id){
    const headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Authorization', this.authService.getToken());


  return new Promise((resolve, reject) => {
    this.http
      .get(questionById(id), {
        headers: headers,

      })
      .toPromise()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
  }

  awaitApprovalDittofi(QuestionID, status) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')

    return new Promise((resolve, reject) => {
      this.http
        .put(awaitApproval(QuestionID, status), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  getUnsavedLS(domainId, description){
    const headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Authorization', this.authService.getToken());


  return new Promise((resolve, reject) => {
    this.http
      .get(getUnsavedLS(domainId, description), {
        headers: headers,

      })
      .toPromise()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
  }

}
