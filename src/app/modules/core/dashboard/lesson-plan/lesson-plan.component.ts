import { Component, OnInit } from '@angular/core';
import { CurriculumService } from 'src/app/modules/_services/lesson-plan.service';

@Component({
  selector: 'app-lesson-plan',
  templateUrl: './lesson-plan.component.html',
  styleUrls: ['./lesson-plan.component.scss'],
})
export class LessonPlanComponent implements OnInit {
  constructor(private _curriculumService: CurriculumService) {}

  ngOnInit(): void {
    this._curriculumService.getClasses();
    this._curriculumService.getSubjects();
    this._curriculumService.getTypes();
  }
}
