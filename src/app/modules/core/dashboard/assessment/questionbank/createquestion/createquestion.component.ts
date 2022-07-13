import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Input,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionSettingsDialogComponent } from 'src/app/modules/_dialogs/question-settings-dialog/question-settings-dialog.component';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { AdDirective } from 'src/app/modules/_directives/ad.directive';
import { MADQuestionMCQComponent } from './madquestion-mcq/madquestion-mcq.component';
import { MADQuestionBlanksComponent } from './MADQuestionBlanks/madquestion-blanks.component';
import { MADQuestionDateComponent } from './MADQuestionDate/madquestion-date.component';
import { MADQuestionDescriptiveComponent } from './MADQuestionDescriptive/madquestion-descriptive.component';
import { MADQuestionNumberComponent } from './MADQuestionNumber/madquestion-number.component';
import { MADQuestionShortTextComponent } from './MADQuestionShortText/madquestion-short-text.component';
import { MADQuestionTFComponent } from './MADQuestionTF/madquestion-tf/madquestion-tf.component';
import { CreateQuestionServiceService } from 'src/app/modules/_services/create-question-service.service';
import { SubjectsManagerService } from 'src/app/modules/_services/subjects-manager.service';
import { SchoolManagerService } from 'src/app/modules/_services/school-manager.service';
import { AcademicClassService } from 'src/app/modules/_services/academic-class.service';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';

@Component({
  selector: 'app-createquestion',
  templateUrl: './createquestion.component.html',
  styleUrls: ['./createquestion.component.css'],
})
export class CreatequestionComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;
  Subject;
  Class;

  classes: any[] = [];
  subjects: any[] = [];

  id = 0;

  // Keep track of list of generated components for removal purposes
  components = [];

  MADQuestionDate = this.componentFactoryResolver.resolveComponentFactory(
    MADQuestionDateComponent
  );
  MADQuestionDescriptive =
    this.componentFactoryResolver.resolveComponentFactory(
      MADQuestionDescriptiveComponent
    );
  MADQuestionNumber = this.componentFactoryResolver.resolveComponentFactory(
    MADQuestionNumberComponent
  );
  MADQuestionShortText = this.componentFactoryResolver.resolveComponentFactory(
    MADQuestionShortTextComponent
  );
  MADQuestionTF = this.componentFactoryResolver.resolveComponentFactory(
    MADQuestionTFComponent
  );
  MADQuestionMCQ = this.componentFactoryResolver.resolveComponentFactory(
    MADQuestionMCQComponent
  );
  edit: any;
  interval: any;
  selectedQuestion: any
  userType: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogServiceService,
    private createQuestionService: CreateQuestionServiceService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private myElement: ElementRef,
    private subjectsManagerService: SubjectsManagerService,
    private schoolService: SchoolManagerService,
    private authManager: AuthManagerService
  ) {}

  ngOnInit(): void {
    this.userType = this.authManager.getTypeOfUser()
    this.createQuestionService.oneQuestion.next(false)
    this.selectedQuestion = this.createQuestionService.selectedQuestion;
    if(this.selectedQuestion != undefined && this.selectedQuestion.edit == true){
      console.log('enter edit')
      console.log(this.selectedQuestion)
      this.selectedQuestion.question.questionText = this.selectedQuestion.question.question_text
      let tempAnswers = []
      for(let ans of  this.selectedQuestion.question.answers){
        ans.answerText = ans.answer_text
        ans.isCorrect = ans.is_correct
        let temp = tempAnswers.find((item) => item.id == ans.id);
        if(temp == undefined){
          tempAnswers.push(ans)
        }
       
      }
      
      this.selectedQuestion.question.answers = tempAnswers
      this.classes = this.createQuestionService.allClasses;
      this.subjects = this.createQuestionService.allSubjects;

      this.Class = this.createQuestionService.SelectedClass;
      this.Subject = this.createQuestionService.SelectedSubject;
     
      console.log(this.classes)
      console.log(this.subjects)
      console.log(this.Class)
      console.log(this.Subject)
      console.log(this.selectedQuestion.question.question_type)
      this.edit = this.selectedQuestion.edit
      // this.getClasses();
      // this.addQuestion(this.selectedQuestion.question.questionType)
      setTimeout(() => 
      {
        this.addQuestion(this.selectedQuestion.question.question_type)
      },
      1000);
    }
    else{
      // if (
      //   this.createQuestionService.SelectedClass === undefined ||
      //   this.createQuestionService.SelectedSubject === undefined
      // ) {
      //   this.dialogService.openDialog({
      //     title: 'Please Reenter this page from the question bank.',
      //     message: 'Please Reenter this page from the question bank.',
      //     confirmText: 'Ok',
      //     cancelText: 'No',
      //     oneButton: true,
      //     DidConfirm: () => {
      //       this.router.navigate(['../assessment/questionbank'],
      //       { queryParams: { type: 'teacher' } });
      //     },
      //   });
      //   this.Class = 'UNDEFINED';
      //   this.Subject = 'UNDEFINED';
      //   return;
      // }
      
      this.classes = this.createQuestionService.allClasses;
      this.subjects = this.createQuestionService.allSubjects;
      this.Class = this.createQuestionService.SelectedClass;
      this.Subject = this.createQuestionService.SelectedSubject;
      
    }

    console.log(this.userType)
    if(this.userType == 'super'){
      this.getSuperAdminClasses(2)
    }
    else if(this.userType == 'admin'){
      this.getAdminClasses();
    }
    else{
      this.getClasses();
    }
 
  }

  getSuperAdminClasses(curriculumId){
    this.subjectsManagerService
    .getSuperAdminClassesDittofi(curriculumId)
      .then((res: any) => {
        console.log(res);
        this.classes = res.data;
        console.log(this.selectedQuestion.question)
        for(let lo of this .selectedQuestion.question.curriculum_questions){
          if(lo.curriculum_id == curriculumId){
            let find = this.classes.find((item) => item.code == lo.gradeCode)
            if(find != undefined){
              this.Class = find
              this.createQuestionService.SelectedClass = this.Class
            }
          }
        }
      })
      .catch((res) => {
        console.log(res);
        this.dialogService.openDialog({
          title: 'Please login through a user instead of a super admin.',
          message: 'test',
          confirmText: 'Yes',
          cancelText: 'No',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }
  getAdminClasses() {
    console.log('called called');
    this.subjectsManagerService
    .getAdminClassesDittofi(1)
      .then((res: any) => {
        console.log(res);
        this.classes = res.data;
      })
      .catch((res) => {
        console.log(res);
        this.dialogService.openDialog({
          title: 'Please login through a user instead of a super admin.',
          message: 'test',
          confirmText: 'Yes',
          cancelText: 'No',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }
  addComponent(componentClass: Type<any>, options?) {

    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(componentClass);
    const component = this.container.createComponent(componentFactory);
    if (options == 'isSingleMCQ') {
      component.instance.isSingleChoiceMode = true;
    }
    this.id = this.id + 1;
    component.instance.ScrollID = this.id;
    if (this.id > 5) {
      this.scrollToQuestion();
    }

    this.components.push(component);
    this.createQuestionService.oneQuestion.next(true)
  }

  async addQuestion(QuestionType: string) {
    console.log('entered function')
    console.log(QuestionType)
    switch (QuestionType) {
      case 'FillInTheBlanks':
        await this.addComponent(MADQuestionBlanksComponent);
        break;
      case 'MCQ':
        await this.addComponent(MADQuestionMCQComponent);
        break;
      case 'SCQ':
        await this.addComponent(MADQuestionMCQComponent, 'isSingleMCQ');
        break;
      case 'Descriptive':
        await this.addComponent(MADQuestionDescriptiveComponent);
        break;
      case 'Blank':
        await this.addComponent(MADQuestionBlanksComponent);
        break;
      case 'TF':
        await this.addComponent(MADQuestionTFComponent);
        break;
      case 'T/F':
        await this.addComponent(MADQuestionTFComponent);
        break;
      case 'ShortText':
        await this.addComponent(MADQuestionShortTextComponent);
        break;
        case 'Text':
        await this.addComponent(MADQuestionShortTextComponent);
        break;
      case 'Number':
        await this.addComponent(MADQuestionNumberComponent);
        break;
      case 'Date':
        await this.addComponent(MADQuestionDateComponent);
        break;
    }
  }

  scrollToQuestion() {
    console.log('scrolling to...' + this.id);
    setTimeout(() => {
      let el = this.myElement.nativeElement.querySelector(
        '#Question' + this.id
      );
      console.log(el);
      el.scrollIntoView();
    }, 100);
  }

  handleAddQuestion() {}
  handleDeleteComponent() {
    console.log('hello world');
  }

  getClasses() {
    this.subjectsManagerService
    .getAllClassesDittofi(this.authManager.getUserId())
    .then((data: any) => {
      console.log(data)
      let cls = data.data;
      this.classes = cls
    })
    .catch((err) => {
      this.dialogService.openDialog({
        title:
          err.error.message,
        message: 'test',
        confirmText: 'OK',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {},
      });
    });

  }

  async didSelectClass() {
    if (this.Class == null || this.Class == undefined) {
      this.Subject = null;
      return;
    }
    console.log(this.Class);
    console.log('code is ' + this.Class.code);
    this.createQuestionService.SelectedClass = this.Class
    this.Subject = undefined
    this.createQuestionService.SelectedSubject = this.Subject
    await this.getTeacherSubjects();
  }

  getTeacherSubjects() {
    this.subjectsManagerService
    .getClassSubjectsAssessment(
      this.Class.id
    )
    .then((res: any) => {
      console.log(res)
      this.subjects = res.data;
    })
    .catch((res) => {
      console.log(res)
    });
  }
  didSelectSubject(event){
    this.createQuestionService.SelectedSubject = event;
  }
}
