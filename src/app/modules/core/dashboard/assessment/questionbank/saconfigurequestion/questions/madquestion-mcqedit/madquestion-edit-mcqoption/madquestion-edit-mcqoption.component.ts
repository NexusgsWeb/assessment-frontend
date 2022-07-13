import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BehaviorSubject } from 'rxjs';
import { answer } from 'src/app/modules/Models/answer';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';

@Component({
  selector: 'app-madquestion-edit-mcqoption',
  templateUrl: './madquestion-edit-mcqoption.component.html',
  styleUrls: ['./madquestion-edit-mcqoption.component.css'],
})
export class MADQuestionEditMCQOptionComponent implements OnInit {
  isLastElement = false;
  @Input() answer: answer;
  content = '';
  @Input() editorisToggled = false;
  @Input() ReferenceCollapser;
  @Input() referenceArray;

  @Output() DeleteListener: EventEmitter<any> = new EventEmitter<any>();
  @Output() SingleChoiceListener: EventEmitter<any> = new EventEmitter<any>();
  firstTime = true;
  config: AngularEditorConfig = {
    sanitize: false,
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    fonts: [
      { class: 'Raleway', name: 'Raleway' },
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Raleway',
    toolbarHiddenButtons: [['bold']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

  constructor(private dialogService: DialogServiceService) {}

  ngOnInit(): void {
    this.manageSubscriptions();
  }
  manageSubscriptions() {
    this.referenceArray.subscribe((value) => {
      if (this.answer === value[value.length - 1]) {
        this.isLastElement = true;
      } else {
        this.isLastElement = false;
      }
    });
    this.ReferenceCollapser.subscribe((res) => {
      console.log('changed');
      console.log(res);
      console.log('done');

      this.editorisToggled = false;
    });
  }
  handleEditorToggle() {
    this.editorisToggled = !this.editorisToggled;
  }
  handleToggleCorrectAnswer() {
    this.answer.isCorrect = !this.answer.isCorrect;
    if (this.answer.isCorrect) {
      this.SingleChoiceListener.emit(this.answer);
      console.log('did choose');
    }
  }
  handleDidDelete(answer) {
    this.dialogService.openDialog({
      title: 'Are you sure you want to delete this choice?',
      message: 'Are you sure you want to delete this choice?',
      confirmText: 'Yes',
      oneButton: false,
      cancelText: 'No',
      DidConfirm: () => {
        this.didConfirmDelete(answer);
      },
    });
  }
  didConfirmDelete(answer) {
    this.DeleteListener.emit(answer);
  }

  didAdd() {
    const letArr: answer[] = this.referenceArray;
    letArr.push({
      answerText: '',
      isCorrect: false,
    });
    this.referenceArray = letArr;
  }
}
