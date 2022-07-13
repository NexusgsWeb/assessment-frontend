import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';
import { ExamrunningService } from './examrunning.service';

@Component({
  selector: 'app-assessment-exam',
  templateUrl: './assessment-exam.component.html',
  styleUrls: ['./assessment-exam.component.css'],
})
export class AssessmentExamComponent implements OnInit {
  AssessmentMetaData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  ExamDidStart = false;
  didReachReviewQuestions = new BehaviorSubject<boolean>(false);

  ExamMetaData: BehaviorSubject<any> = new BehaviorSubject<any>({

  });
  // Keep track of list of generated components for removal purposes
  components = [];

  constructor(
    private authService: AuthManagerService,
    private examrunning: ExamrunningService,
    private dialogService: DialogServiceService,
    private assessmentManager: AssessmentManagerService,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    // this.examrunning.PrepareQuestionForResuming(this.examrunning.testing);
    await this.assessmentManager
      .getSpecificAssessmentDittofi(this.activatedRoute.snapshot.params['id'])
      .then((res: any) => {
        // this.AssessmentMetaData = res.assessment;
        console.log('hello maher')
        console.log(res)
        const ExamMetaData = this.ExamMetaData.getValue();
        ExamMetaData.AssessmentInfo = {}
        ExamMetaData.TotalAmount = 55
        ExamMetaData.TimeElapsed = 0
        ExamMetaData.CurrentQuestionIndex = 0
        ExamMetaData.ExamIsFinished = false
        ExamMetaData.isResuming = false

          res.data.startsAtDateTime = res.data.from_date
          res.data.endsAtDateTime = res.data.to_date
          res.data.testDurationInMinuets = res.data.duration
          res.data.subjectTitle = res.data.subject_name
          if(res.data.attempts_count ==0){
            res.data.statues = 'Not Started'
          }
          else {
            if(res.data.is_completed == true){
              res.data.statues = 'Completed'
            }
            else{
              res.data.statues = 'Can Resume'
            }
          }

        ExamMetaData.AssessmentMetaData = res.data;
        console.log('YES HI');
        console.log(ExamMetaData);
        this.ExamMetaData.next(ExamMetaData);
      })
      .catch((err) => {
        console.log(err);
        console.log('there was an error getting ur assessment data');
      });
    console.log(this.AssessmentMetaData);
  }
////////////////////////////////////////////////////////////////////////////////////////////////

ResumeExam() {
  this.assessmentManager
    .resumeExamDittofi(
      this.activatedRoute.snapshot.params['id'],
      this.authService.getUserId()
    )
    .then((res: any) => {
      console.log('resume resume')
      let test = res
      console.log(test);
      const ExamMetaData = this.ExamMetaData.getValue();
      ExamMetaData.isResuming = true;

      var resQues = [];
      res.data.questions.forEach(function(item){
        var i = resQues.findIndex(x => x.id == item.id);
        if(i <= -1){
          resQues.push(item);
        }
      });
      res.data.questions = resQues

      var resAns = [];
      res.data.answers.forEach(function(item){
        var i = resAns.findIndex(x => x.id == item.id);
        if(i <= -1){
          resAns.push(item);
        }
      });
      res.data.answers = resAns

      var resAnswersStudent = [];
      res.data.answers_std.forEach(function(item){
        var i = resAnswersStudent.findIndex(x => x.id == item.id);
        if(i <= -1){
          resAnswersStudent.push(item);
        }
      });

      res.data.answers_std = resAnswersStudent

      let tempQues = [];
      for(let ques of res.data.questions){
        console.log('question0')
        let temp = tempQues.find((item) => item.id == ques.id);
        if(temp == undefined || temp == null){
          let tempAnswers = [];
          for(let answer of res.data.answers){
            let t_ans = tempAnswers.find((item) => item.id === answer.id);


            if(t_ans === undefined || t_ans === null){
              if(answer.question_id == ques.id){
                tempAnswers.push(answer);
              }
            }
          }
          console.log('question1')
          console.log(tempAnswers)
          ques.answers = tempAnswers;

          let tempStudentAnswers = [];
          for(let student_answer of res.data.answers_std){
            console.log('entered entered entered')
            console.log(student_answer)
            console.log(ques)
            console.log('----------------------------------')
            if(student_answer.answer_id == null || student_answer.answer_id == undefined){
              let answered = ques.answers.find((item) => item.id == 0);
              if(answered != undefined){
                let found = tempStudentAnswers.find((item) => item.id == student_answer.id);
                if(found == undefined){
                  student_answer.assessmentQuestionId = student_answer.assessment_question_id
                  tempStudentAnswers.push(student_answer)
                  console.log('entered true')
                  continue

                }
              }

            }
            else{
              let answered = ques.answers.find((item) => item.id == student_answer.answer_id)
              console.log(answered)
              if(answered != undefined){
                let found = tempStudentAnswers.find((item) => item.id == student_answer.id);
                if(found == undefined){
                  student_answer.assessmentQuestionId = student_answer.assessment_question_id
                  tempStudentAnswers.push(student_answer)
                  console.log('entered true')
                  continue

                }
              }
            }


          }
          console.log('question2')
          console.log(tempStudentAnswers)
          ques.studentAnswers = tempStudentAnswers
          tempQues.push(ques);

        }
      }
      res.data.questions = tempQues;
      console.log('question questions')
      console.log(res.data)

      let tempAttempts = []
      for(let attempt of res.data.assessment_attempt){
        let t = tempAttempts.find((item) => item.id == attempt.id);
        if(t == undefined || t == null){
          attempt.studentId = attempt.student_id
          tempAttempts.push(attempt)
        }
      }
      res.attemptMetadata = tempAttempts;



      //start of method
      let attempt = []
      attempt.push(res.data)
      res.attempt = attempt
      res.data = null
      console.log("final final")
      res.allQuestions = {};
      res.allQuestions.questions = res.attempt[0].questions
      console.log(res)
      let time = 0;
      for(let ques of res.attempt[0].questions){
        for(let std of ques.studentAnswers){
          time += std.duration
        }
      }

      res.timeTakenSoFarInSec = time

      if (res.attempt.length === 0) {
        ExamMetaData.Questions = res.allQuestions.questions;
        if (res.allQuestions.questions.length === 0) {
          //There are no questions....
          this.dialogService.openDialog({
            title:
              'There are no Questions in this Assessment... Please Recreate a new one',
            message:
              'There are no Questions in this Assessment... Please Recreate a new on',
            confirmText: 'Ok',
            cancelText: 'No',
            oneButton: true,
            DidConfirm: () => {},
          });
          return;
        }
        this.ExamDidStart = true;

        console.log(res);
        console.log('UNABLE TO RESUME');
      } else {

        const attemptQuestions = res.attempt
        let questionsAnswered = [];
        console.log('entered here0')
        console.log(attemptQuestions)

        for(let att of attemptQuestions){
          console.log('entered here1')
          console.log(att)
          for(let ques of att.questions){
            console.log('entered here3')
            console.log(ques)
            if(ques.studentAnswers.length > 0){

              questionsAnswered.push(ques);
              // let question = questionsAnswered.find(item => {
              //   console.log(item.id)
              //   console.log(ques.studentAnswers[0].assessmentQuestionId)
              //   console.log('---------------------------------------------')
              //   item.id == ques.studentAnswers[0].assessmentQuestionId});
              // if(question == null || question == undefined){

              // }

            }
          }
        }

        console.log(questionsAnswered)
        let ansQ = []
        for(let ques of questionsAnswered){
          ansQ.push(ques.id)
        }
        this.assessmentManager.answeredQuestions$.next(ansQ);
        this.ExamDidStart = true;

        console.log(res)
        var newQuestions =
          this.examrunning.MixResumingQuestionsWithOldQuestions(
            res.allQuestions.questions,
            this.examrunning.PrepareQuestionForResuming(res.attempt[0])
          );

          console.log('returned questions')
          console.log( this.examrunning.PrepareQuestionForResuming(res.attempt[0]))
          console.log(res.allQuestions.questions)
          console.log(newQuestions)
        ExamMetaData.Questions = newQuestions;
        console.log(newQuestions)
        //There are old questions
      }
      var assessmentInfo = res.allQuestions;
      var timeLeft =
        res.allQuestions.testDurationInMinuets -
        Math.floor(res.timeTakenSoFarInSec / 60);
      assessmentInfo.testDurationInMinuets = timeLeft;
      ExamMetaData.AssessmentInfo = assessmentInfo;
      if (res.timeTakenSoFarInSec === null || res.timeTakenSoFarInSec === 1) {
        ExamMetaData.TimeElapsed = 2;
      } else {
        ExamMetaData.TimeElapsed = res.timeTakenSoFarInSec;
      }
      ExamMetaData.assessmentAttempt = res.attemptMetadata;
      console.log(ExamMetaData)
      console.log(res.attempt[0].id)
      console.log(res.attemptMetadata[res.attemptMetadata.length - 1])

      this.ExamMetaData.next(ExamMetaData);
      this.AssessmentMetaData.next({
        assessment: {
          id: res.attempt[0].id,
        },
        assessmentAttempt: {
          id: res.attemptMetadata[res.attemptMetadata.length - 1].id,
          studentId: res.attemptMetadata[res.attemptMetadata.length - 1].studentId,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      this.dialogService.openDialog({
        title: 'You have exceeded the maximum number of attempts. Please contact your teacher.',
        message: 'You have exceeded the maximum number of attempts. Please contact your teacher.',
        confirmText: 'Ok',
        cancelText: 'No',
        oneButton: true,
        DidConfirm: () => {},
      });
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////

  private getTime(date?: Date) {
    return date != null ? date.getTime() : 0;
}


public sortByDueDate(myArray: any[]): void {
    myArray.sort((a: any, b: any) => {
        return this.getTime(a.dueDate) - this.getTime(b.dueDate);
    });
}

  StartExam() {
    this.assessmentManager
      .startAssessmentAndGetQuestionsDittofi(this.activatedRoute.snapshot.params['id'], this.authService.getUserId())
      .then((res: any) => {
        console.log(res);
        if (res.data.questions.length === 0) {
          //There are no questions....
          this.dialogService.openDialog({
            title:
              'There are no Questions in this Assessment... Please ask your teacher to recreate it.',
            message:
              'There are no Questions in this Assessment... Please ask your teacher to recreate it.',
            confirmText: 'Ok',
            cancelText: 'No',
            oneButton: true,
            DidConfirm: () => {},
          });
          return;
        }


        var tempQuestions = [];
        for(let question of res.data.questions){
          let tempQ = tempQuestions.find((item) => item.id == question.id);
          if(tempQ == undefined){
            tempQuestions.push(question);
            let tempAnswers = [];
            for(let answer of res.data.answers){
              let tempA = tempAnswers.find((item) => item.id == answer.id);
              if(tempA == undefined){
                tempAnswers.push(answer);
              }
            }
            question.answers = tempAnswers
          }
        }
        res.data.questions = tempQuestions
        if(res.data.random_order == true){
          for(let i =0; i< res.data.questions.length; i++){
            let pos = Math.floor(Math.random() * (res.data.questions.length));
            let temp = res.data.questions[i];
            res.data.questions[i] = res.data.questions[pos];
            res.data.questions[pos] = temp;
          }
        }

        let assessmentAttempt = res.data.assessment_attempt.sort((a, b) => (new Date(a.created_at).getTime() > new Date(b.created_at).getTime() ? -1 : 1))[0];
        res.data.assessmentAttempt = assessmentAttempt;
        res.data.assessment_attempt = null;

        res.data.answers = []
        console.log(res.data)
        for(let q of res.data.questions){
          q.questionType = q.question_type
          q.questionText = q.question_text
          q.testDurationInMinuets = q.duration
          for(let ans of q.answers){
            ans.answerText = ans.answer_text
            ans.isCorrect = ans.is_correct
            ans.isSelected = false
          }
        }
        this.ExamDidStart = true;
        const ExamMetaData = this.ExamMetaData.getValue();
        var qs = this.examrunning.PrepareQuestionForStarting(
          res.data.questions
        );
        console.log('ttttttttt')
        console.log(qs)
        ExamMetaData.Questions = qs;
        ExamMetaData.AssessmentInfo = res.data;
        this.ExamMetaData.next(ExamMetaData);
        this.AssessmentMetaData.next(res.data);
        console.log(this.AssessmentMetaData.getValue());
      })
      .catch((err) => {
        console.log(err);
        console.log('There was an Error Starting your Assessment.');
        this.dialogService.openDialog({
          title: 'There was an Error Starting your Assessment.',
          message: 'There was an Error Starting your Assessment.',
          confirmText: 'Ok',
          cancelText: 'No',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }
  LoadQuestions() {}
  CurrentQuestion() {}

  didAnswerQuestionAndSubmitted(event) {
    console.log(event);
    //API LOGIC - success.. next question
    this.NextQuestion('NormalNavigate');
  }

  NextQuestion($event) {
    console.log('EMMITTEDD!!!!');
    console.log('message is ' + $event);
    const ExamMetaData = this.ExamMetaData.getValue();
    console.log(ExamMetaData.CurrentQuestionIndex + 1)
    console.log(ExamMetaData.Questions.questions.length - 1)
    if (ExamMetaData.CurrentQuestionIndex === ExamMetaData.TotalAmount) return;
    if (
      ExamMetaData.CurrentQuestionIndex + 1 >
      ExamMetaData.Questions.questions.length - 1
    ) {
      console.log('last question reached');
      this.didReachReviewQuestions.next(true);
      return;
    }
    console.log('index' + ExamMetaData.CurrentQuestionIndex);
    console.log('questions length' + ExamMetaData.Questions.length);
    ExamMetaData.CurrentQuestionIndex = ExamMetaData.CurrentQuestionIndex + 1;
    this.ExamMetaData.next(ExamMetaData);
  }
}
