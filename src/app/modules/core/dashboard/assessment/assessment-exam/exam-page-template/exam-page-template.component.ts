import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { MADQuestionShortTextComponent } from '../../questionbank/createquestion/MADQuestionShortText/madquestion-short-text.component';
import { MadquestionBlanksAssessComponent } from '../questions/madquestion-blanks-assess/madquestion-blanks-assess.component';
import { MadquestionDateAssessComponent } from '../questions/madquestion-date-assess/madquestion-date-assess.component';
import { MadquestionDescriptiveAssessComponent } from '../questions/madquestion-descriptive-assess/madquestion-descriptive-assess.component';
import { MadquestionMcqAssessComponent } from '../questions/madquestion-mcq-assess/madquestion-mcq-assess.component';
import { MadquestionNumberAssessComponent } from '../questions/madquestion-number-assess/madquestion-number-assess.component';
import { MadquestionShorttextAssessComponent } from '../questions/madquestion-shorttext-assess/madquestion-shorttext-assess.component';
import { MadquestionTfAssessComponent } from '../questions/madquestion-tf-assess/madquestion-tf-assess.component';
import { ReviewQuestionsComponent } from '../review-questions/review-questions.component';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';

@Component({
  selector: 'app-exam-page-template',
  templateUrl: './exam-page-template.component.html',
  styleUrls: ['./exam-page-template.component.css'],
})
export class ExamPageTemplateComponent implements OnInit {
  @Input() AssessmentMetaData: BehaviorSubject<any>;
  @Input() ExamMetaData: BehaviorSubject<any>;
  @Input() didReachReviewQuestions: BehaviorSubject<boolean>;
  @Output() QuestionDoneEmitter = new EventEmitter<any>();
  components = [];

  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;
  constructor(
    private assessmentService: AssessmentManagerService,
    private dialogService: DialogServiceService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private Router: Router,
    private authManager: AuthManagerService
  ) {}

  ngOnInit() {}
  ngAfterContentInit(): void {
    console.log(this.AssessmentMetaData);
  }
  ngAfterViewInit() {

    this.didReachReviewQuestions.pipe().subscribe((res) => {
      console.log('review ques')
      console.log(res)
      if (this.ExamMetaData.getValue().ExamIsFinished === true) {
        console.log('exam is apparently done');
        return;
      }
      if (res === true) {
        const examMetaData = this.ExamMetaData.getValue();
        console.log('NOW DISPLAYING REVIEW QUESTIONS..');
        for (let i = 0; i < examMetaData.Questions.questions.length; i++) {
          this.PreviewQuestion(
            examMetaData.Questions.questions[i].questionType,
            i
          );
        }
        this.didReachReviewQuestions.next(false);
      } else {
      }
    });
    this.ExamMetaData.subscribe((res) => {
      if (this.didReachReviewQuestions.getValue() === true) return;
      if (this.ExamMetaData.getValue().ExamIsFinished === true) {
        console.log('exam is apparently done');
        return;
      }
      console.log('i am exiting');
      console.log(res.Questions.questions)
      console.log(res.CurrentQuestionIndex)
      console.log(res)
      this.PreviewQuestion(
        res.Questions.questions[res.CurrentQuestionIndex].questionType
      );
    });
    // this.ExamMetaData.subscribe((res) => {
    //   this.PreviewQuestion(
    //     res.Questions[res.CurrentQuestionIndex].cq.questions.questionType
    //   );
    // });
  }
  didClickNextQuestion() {
    this.QuestionDoneEmitter.emit('NEXT');
  }
  didClickPreviousQuestion() {}
  didClickSpecificQuestions(index) {
    if (this.ExamMetaData.getValue().ExamIsFinished === true) {
      console.log('exam is apparently done');
      return;
    }
    //Destroy all old questions
    for (let i = 0; i < this.components.length; i++) {
      console.log('deleting..');
      this.components[i].instance.destroyQuestion();
    }
    const examData = this.ExamMetaData.getValue();
    examData.CurrentQuestionIndex = index;
    this.ExamMetaData.next(examData);
  }
  addComponent(
    componentClass: Type<any>,
    isReviewQuestion = false,
    questionIndex?
  ) {
    console.log("called function")
    console.log(isReviewQuestion)
    console.log(questionIndex)
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(componentClass);
      console.log(this.container)
    const component = this.container.createComponent(componentFactory);
    if (isReviewQuestion === false) {
      if (questionIndex === undefined || questionIndex === null) {
        const examMetaData = this.ExamMetaData.getValue();
        console.log(examMetaData)
        const SpecificQuestion =
          examMetaData.Questions.questions[examMetaData.CurrentQuestionIndex];
        component.instance.QuestionDetails = SpecificQuestion;
        console.log(this.AssessmentMetaData);

        component.instance.AssessmentMetaData = this.AssessmentMetaData;
      } else {
        const examMetaData = this.ExamMetaData.getValue();
        console.log(examMetaData)
        const SpecificQuestion = examMetaData.Questions.questions[questionIndex];
        component.instance.QuestionDetails = SpecificQuestion;
        component.instance.isDisabled = true;
      }
      component.instance.QuestionDoneEmitter.subscribe((res) => {
        this.QuestionDoneEmitter.emit(res);
        component.instance.destroyQuestion();
      });
    } else {
      const examMetaData = this.ExamMetaData.getValue();

      // console.log('isReviewtrue :0');
      const SpecificQuestion = examMetaData.Questions.questions[questionIndex];
      console.log(SpecificQuestion);
      component.instance.QuestionDetails = SpecificQuestion;

      component.instance.AssessmentMetaData = this.AssessmentMetaData;
      console.log(this.AssessmentMetaData);
      component.instance.QuestionDoneEmitter.subscribe((res) => {
        this.QuestionDoneEmitter.emit(res);
        component.instance.destroyQuestion();
      });
    }
    this.components.push(component);
  }

  async PreviewQuestion(QuestionType, QuestionIndex?) {
    console.log('called..');
    console.log(QuestionType)
    switch (QuestionType) {
      case 'MCQ':
        await this.addComponent(
          MadquestionMcqAssessComponent,
          false,
          QuestionIndex
        );
        break;
      case 'SCQ':
        await this.addComponent(
          MadquestionMcqAssessComponent,
          false,
          QuestionIndex
        );
        break;
      case 'Descriptive':
        await this.addComponent(
          MadquestionDescriptiveAssessComponent,
          false,
          QuestionIndex
        );
        break;
      case 'FillInTheBlanks':
        await this.addComponent(
          MadquestionBlanksAssessComponent,
          false,
          QuestionIndex
        );
        break;
      case 'T/F':
        await this.addComponent(
          MadquestionTfAssessComponent,
          false,
          QuestionIndex
        );
        break;
      case 'Text':
        await this.addComponent(
          MadquestionShorttextAssessComponent,
          false,
          QuestionIndex
        );
        break;
      case 'Number':
        await this.addComponent(
          MadquestionNumberAssessComponent,
          false,
          QuestionIndex
        );
        break;
      case 'Date':
        await this.addComponent(
          MadquestionDateAssessComponent,
          false,
          QuestionIndex
        );
        break;
      // case 'ReviewQuestions':
      //   await this.addComponent(ReviewQuestionsComponent, true, QuestionIndex);
      //   break;
    }
  }
  endExam() {
    const ExamMetaData = this.AssessmentMetaData.getValue();
    console.log(ExamMetaData)
    let id = ExamMetaData.id 
    if(id == undefined){
      id = ExamMetaData.assessment.id
    }
    this.dialogService.openDialog({
      title: 'Are you sure you want to end the exam?',
      message: 'Are you sure you want to end the exam?',
      confirmText: 'Yes',
      oneButton: false,
      cancelText: 'No',
      DidConfirm: () => {
        console.log(ExamMetaData);
        this.assessmentService
          .endAssessmentDittofi(id, this.authManager.getUserId())
          .then((res) => {
            console.log(res)
            const ExamMetaData = this.ExamMetaData.getValue();
            ExamMetaData.ExamIsFinished = true;
            this.ExamMetaData.next(ExamMetaData);
          })
          .catch((err) => {
            console.log(err)
            this.dialogService.openDialog({
              title: 'There was an error ending your exam',
              message: 'There was an error ending your exam',
              confirmText: 'Ok',
              oneButton: true,
              cancelText: 'No',
              DidConfirm: () => {},
            });
          });
      },
    });
  }
  navigateBackToAssessments() {
    console.log('navigating?');
    this.Router.navigate(['/assessment/viewAssessments/student']);
  }
  questionDone(event) {
    console.log('question done');
    console.log('message' + event);
  }
}
