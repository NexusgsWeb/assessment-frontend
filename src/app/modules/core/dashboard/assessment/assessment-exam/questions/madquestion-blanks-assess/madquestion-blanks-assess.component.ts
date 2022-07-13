import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';

@Component({
  selector: 'app-madquestion-blanks-assess',
  templateUrl: './madquestion-blanks-assess.component.html',
  styleUrls: ['./madquestion-blanks-assess.component.css'],
})
export class MadquestionBlanksAssessComponent implements OnInit {
  TIME_SPENT_ON_QUESTION = 0;
  didSubmit = false;
  @Input() AssessmentMetaData;
  @Input() QuestionDetails;
  @Input() isDisabled = false;

  @Output() QuestionDoneEmitter: EventEmitter<any> = new EventEmitter<any>();
  BlankAnswers: any[] = [];
  constructor(
    private assessmentManager: AssessmentManagerService,
    private host: ElementRef<HTMLElement>,
    private dialogService: DialogServiceService,
    private authManager: AuthManagerService
  ) {}

  ngOnInit(): void {
    this.didSubmit = false;
    this.TIME_SPENT_ON_QUESTION = 0;
    this.TriggerTimer();
    console.log(this.QuestionDetails)
    if (
      this.QuestionDetails.answers.length !==
      this.countBlankSpaces()
    ) {
      console.log('reconstruct');
      console.log(this.QuestionDetails)
      let tempAns = this.QuestionDetails.answers.filter((item) => item.question_id == this.QuestionDetails.id)
      this.QuestionDetails.answers = [];
      console.log(tempAns)
      for (let i = 0; i < tempAns.length; i++) {
        this.QuestionDetails.answers.push({
          id: tempAns[i].id,
          answerText: '',
        });
      }
    }
  }
  TriggerTimer() {
    if (this.didSubmit || this.isDisabled) return;
    setTimeout(() => {
      this.TIME_SPENT_ON_QUESTION++;
      this.TriggerTimer();
    }, 1000);
  }
  countBlankSpaces() {
    return this.countOccurences(
      this.QuestionDetails.questionText,
      '[blank]'
    );
  }
  countOccurences(string, word) {
    return string.split(word).length - 1;
  }
  destroyQuestion() {
    this.TIME_SPENT_ON_QUESTION = 0;
    this.didSubmit = true;

    this.host.nativeElement.remove();
  }
  confirmAnswer() {
    //Validation
    let temp = this.assessmentManager.answeredQuestions$.getValue()
    let found = temp.find((item) => item == this.QuestionDetails.id);
    if(found == undefined){
      temp.push(this.QuestionDetails.id)
    }
    this.assessmentManager.answeredQuestions$.next(temp);
    this.AssessmentMetaData.answered = this.assessmentManager.answeredQuestions$.getValue().length

    for (let i = 0; i < this.QuestionDetails.answers.length; i++) {
      if (this.QuestionDetails.answers[i].answerText === '') {
        this.dialogService.openDialog({
          title: 'Make sure all fields are filled.',
          message: 'Make sure all fields are filled.',
          confirmText: 'Ok',
          oneButton: true,
          cancelText: 'No',
          DidConfirm: () => {},
        });
        return;
      }
    }

    //MCQ, SCQ, T/F, Number, Date, Text, FillInTheBlanks, Descriptive
    const state = this.AssessmentMetaData.getValue();
    console.log(state)
    const SubmitAnswerObject = {
      attemptId: state.assessmentAttempt.id,
      studentId: this.authManager.getUserId(),
      curriculumQuestionId: this.QuestionDetails.cq_id,
      assessmentQuestionId: this.QuestionDetails.assessment_question_id,
      answers: [],
    };
    for (let i = 0; i < this.QuestionDetails.answers.length; i++) {
      console.log(this.QuestionDetails.answers)
      SubmitAnswerObject.answers.push({
        id: this.QuestionDetails.answers[i].id,
        assessmentQuestionId: this.QuestionDetails.id,
        answerValue: this.QuestionDetails.answers[i].answerText,
        answerValueType: 'FillInTheBlanks',
        durationInSec: this.TIME_SPENT_ON_QUESTION,
      });
    }
    /////

    console.log(SubmitAnswerObject)
    console.log(state)
    this.assessmentManager
      .SubmitStudentQuestionDittofi(state.id, SubmitAnswerObject)
      .then((res) => {
        //Question Stored Successfully..
        this.QuestionDoneEmitter.emit('QUESTION DONE GO TO NEXT');
        this.didSubmit = true;
        this.TIME_SPENT_ON_QUESTION = 0;
        console.log(SubmitAnswerObject);
      })
      .catch((err) => {
        console.log(err)
        //There was an Error submitting your question
        this.dialogService.openDialog({
          title:
            'There was an error Submitting Your Question, Please Try Again.',
          message:
            'There was an error Submitting Your Question, Please Try Again.',
          confirmText: 'Ok',
          oneButton: true,
          cancelText: 'No',
          DidConfirm: () => {},
        });
        console.log('THERE WAS AN ERROR SUBMITTING YOUR QUESTION.');
      });
    // this.QuestionDetails.cq.questions.answers[0].answerText;
  }

  containsNBSP(questionText : string){

    if(questionText == undefined || questionText == ''){
      return false
    }
    else if(questionText.includes('&nbsp')){
      return true;
    }
    else{
      return false;
    }
  }
}
