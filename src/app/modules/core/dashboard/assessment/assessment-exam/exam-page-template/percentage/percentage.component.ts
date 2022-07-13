import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';

@Component({
  selector: 'app-percentage',
  templateUrl: './percentage.component.html',
  styleUrls: ['./percentage.component.css']
})
export class PercentageComponent implements OnInit {
  @Input() AssessmentMetaData: BehaviorSubject<any>;
  @Input() ExamMetaData: BehaviorSubject<any>;
  answerQuestions;
  perc = 0
  count = 0
  constructor(public assessmentManager: AssessmentManagerService) { }

  ngOnInit(): void {
    this.answerQuestions = this.assessmentManager.answeredQuestions$.getValue();
    console.log("percentage percentage")
    console.log(this.answerQuestions)

    if(this.assessmentManager.answeredQuestions$.getValue() != null ||
    this.assessmentManager.answeredQuestions$.getValue() != undefined){
      this.count = this.assessmentManager.answeredQuestions$.getValue().length
    }
    let temp = (this.count * 100) /
    (this.ExamMetaData).getValue().Questions.length

    if(temp <= 100){
      this.perc = temp
    }
    else{
      this.perc = 100
    }

  }

}
