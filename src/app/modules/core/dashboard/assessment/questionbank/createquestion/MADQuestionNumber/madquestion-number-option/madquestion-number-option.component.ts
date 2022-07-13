import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { answer } from 'src/app/modules/Models/answer';
import { question } from 'src/app/modules/Models/question';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';

@Component({
  selector: 'app-madquestion-number-option',
  templateUrl: './madquestion-number-option.component.html',
  styleUrls: ['./madquestion-number-option.component.css'],
})
export class MADQuestionNumberOptionComponent implements OnInit {
  @Input() answer: answer;
  @Input() referenceArray;
  isLastElement = false;
  @Output() DeleteListener: EventEmitter<any> = new EventEmitter<any>();

  constructor(private dialogService: DialogServiceService) {}

  ngOnInit(): void {}

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
  handleToggleCorrectAnswer() {
    this.answer.isCorrect = !this.answer.isCorrect;
  }
}
