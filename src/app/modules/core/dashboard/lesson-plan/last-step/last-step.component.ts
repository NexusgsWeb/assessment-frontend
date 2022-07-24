import { Component, OnInit } from '@angular/core';
import { LessonPlanService } from 'src/app/modules/_services/lesson-plan.service';

@Component({
  selector: 'app-last-step',
  templateUrl: './last-step.component.html',
  styleUrls: ['./last-step.component.css']
})

export class LastStepComponent implements OnInit {
  lessonPlanPerPeriod$ = this._lessonPlanService.lessonPlanPerPeriod$

  constructor(private _lessonPlanService: LessonPlanService) { }

  ngOnInit(): void {
  }

}
