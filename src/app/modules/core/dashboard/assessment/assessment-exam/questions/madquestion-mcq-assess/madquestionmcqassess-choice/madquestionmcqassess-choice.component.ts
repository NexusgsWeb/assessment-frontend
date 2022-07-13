import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-madquestionmcqassess-choice',
  templateUrl: './madquestionmcqassess-choice.component.html',
  styleUrls: ['./madquestionmcqassess-choice.component.css'],
})
export class MadquestionmcqassessChoiceComponent implements OnInit {
  @Input() answerDetails;
  @Output() SelectChoiceListener = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    console.log("maher maher maher")
    console.log(this.answerDetails)
    if (
      this.answerDetails.isSelected === undefined ||
      this.answerDetails.isSelected === null
    ) {
      this.answerDetails.isSelected = false;
    }
  }
  didSelectAnswer() {
    this.SelectChoiceListener.emit(this.answerDetails);
    this.answerDetails.isSelected = !this.answerDetails.isSelected;
  }
}
