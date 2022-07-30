import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { LearningPathSteps } from 'src/app/modules/Models/LearningPathSteps';
import { LearningPathActivitiesService } from 'src/app/modules/_services/learningPathActivities.service';
import { LearningPathStepsService } from 'src/app/modules/_services/learningPathSteps.service';

@Component({
  selector: 'app-learning-path',
  templateUrl: './learning-path.component.html',
  styleUrls: ['./learning-path.component.css'],
})
export class LearningPathComponent implements OnInit {
  learningPathId: number = 0;
  selectedIndex: number = 0;

  learningPathStepsDetails$: Observable<any>;

  @ViewChild(MatAccordion) accordion?: MatAccordion;

  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private route: ActivatedRoute,
    private _learningPathStepsService: LearningPathStepsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.learningPathId = params['id'];
    });

    /** TODO Remove timeout **/

    setTimeout(() => {
      this.learningPathStepsDetails$ =
        this._learningPathStepsService.getLearningPathStepsDetails(
          this.learningPathId
        );
    }, 2000);
  }

  onAccordionChange(learningPathId: number): void {
    console.log(learningPathId);
  }

  onActivityClick(activityId: number): void {
    console.log(activityId);
  }

  addLearningPathStep(): void {}
}
