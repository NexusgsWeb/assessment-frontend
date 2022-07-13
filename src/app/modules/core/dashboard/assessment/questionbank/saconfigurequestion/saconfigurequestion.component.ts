import {
  Component,
  ComponentFactoryResolver,
  Inject,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { QuestionmanagerService } from 'src/app/modules/_services/questionmanager.service';
import { RemarksmanagerService } from 'src/app/modules/_services/remarksmanager.service';
import { MADQuestionBlanksEditComponent } from './questions/madquestion-blanks-edit/madquestion-blanks-edit.component';
import { MADQuestionDateEditComponent } from './questions/madquestion-date-edit/madquestion-date-edit.component';
import { MADQuestionDescriptiveEditComponent } from './questions/madquestion-descriptive-edit/madquestion-descriptive-edit.component';
import { MADQuestionMCQEditComponent } from './questions/madquestion-mcqedit/madquestion-mcqedit.component';
import { MADQuestionNumberEditComponent } from './questions/madquestion-number-edit/madquestion-number-edit.component';
import { MADQuestionShortTextEditComponent } from './questions/madquestion-short-text-edit/madquestion-short-text-edit.component';
import { MADQuestionTFEditComponent } from './questions/madquestion-tfedit/madquestion-tfedit.component';
import { __metadata } from 'tslib';

@Component({
  selector: 'app-saconfigurequestion',
  templateUrl: './saconfigurequestion.component.html',
  styleUrls: ['./saconfigurequestion.component.css'],
})
export class SAconfigurequestionComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  QuestionData;
  edit: boolean = false;
  RemarkFieldModel = '';
  RemarksList: any = [];
  components = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private questionManager: QuestionmanagerService,
    private remarkManager: RemarksmanagerService,
    private RemarksService: RemarksmanagerService,
    private activatedRoute: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,

    private dialog: DialogServiceService
  ) {}

  async ngOnInit(): Promise<void> {
    this.QuestionData = this.data.question;
    this.edit = this.data.edit;
    console.log(this.QuestionData);
    this.RemarksList = (
      (await this.RemarksService.getRemarksForQuestion(
        this.QuestionData.question.id
      )) as any
    ).remarks;
    this.addQuestion(this.QuestionData.question.questionType);
    console.log(this.RemarksList);
  }
  addRemark() {
    const TestRemark = {
      remark: this.RemarkFieldModel,
    };
    this.remarkManager
      .addRemarksForQuestionDittofi(this.QuestionData.question.id, TestRemark)
      .then((res) => {
        this.RemarksList.push(TestRemark);
        this.RemarkFieldModel = '';
        this.dialog.openDialog({
          title: 'Your Remark has been added.',
          message: 'Your Remark has been added.',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      })
      .catch((err) => {
        this.dialog.openDialog({
          title: 'There was an error adding your remark.',
          message: 'There was an error adding your remark.',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }
  approveQuestion() {
    this.questionManager
      .approveQuestionDittofi(this.QuestionData.question.id)
      .then((res) => {
        //Question successfully approved
        this.dialog.openDialog({
          title: 'The Question has been successfully approved.',
          message: 'The Question has been successfully approved.',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {
            this.router.navigateByUrl(
              '/assessment/questionbank/createQuestion'
            );
          },
        });
      })
      .catch((err) => {
        //Error
        this.dialog.openDialog({
          title: 'There was an error creating your question.',
          message: 'There was an error creating your question.',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }
  addComponent(componentClass: Type<any>, options?) {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(componentClass);
    const component = this.container.createComponent(componentFactory);
    component.instance.QuestionDetails = this.QuestionData.question;
    if (options == 'isSingleMCQ') {
      component.instance.isSingleChoiceMode = true;
    }

    this.components.push(component);
  }
  async addQuestion(QuestionType: string) {
    switch (QuestionType) {
      case 'MCQ':
        await this.addComponent(MADQuestionMCQEditComponent);
        break;
      case 'SCQ':
        await this.addComponent(MADQuestionMCQEditComponent, 'isSingleMCQ');
        break;
      case 'Descriptive':
        await this.addComponent(MADQuestionDescriptiveEditComponent);
        break;
      case 'Blank':
        await this.addComponent(MADQuestionBlanksEditComponent);
        break;
      case 'TF':
        await this.addComponent(MADQuestionTFEditComponent);
        break;
      case 'ShortText':
        await this.addComponent(MADQuestionShortTextEditComponent);
        break;
      case 'Number':
        await this.addComponent(MADQuestionNumberEditComponent);
        break;
      case 'Date':
        await this.addComponent(MADQuestionDateEditComponent);
        break;
    }
  }

  editQuestion(){
    this.questionManager.editQuestionDittofi(this.QuestionData.id, this.QuestionData, null).then((res) => {
      console.log('question edited successfully')
    })
    .catch((res) => {
      console.log(res)
    })
  }
}
