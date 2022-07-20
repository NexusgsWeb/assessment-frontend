import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LessonPlanService } from 'src/app/modules/_services/lesson-plan.service';

@Component({
  selector: 'app-step-four',
  templateUrl: './step-four.component.html',
  styleUrls: ['./step-four.component.css']
})
export class StepFourComponent implements OnInit {
  @Input() finish?: Observable<void>
  @Output() validFormFour = new EventEmitter<boolean>()

  summary: any
  lessonPlan$ = this._lessonPlanService.lessonPlan$
  private lessonPlanSubscription?: Subscription

  constructor(private _lessonPlanService: LessonPlanService) { }

  ngOnInit(): void {
    this.lessonPlanSubscription = this.lessonPlan$?.subscribe((lessonPlan) => lessonPlan.length > 0 ? console.log(lessonPlan) : null)
  }

  ngOnDestroy(){
    this.lessonPlanSubscription?.unsubscribe()
  }
}
