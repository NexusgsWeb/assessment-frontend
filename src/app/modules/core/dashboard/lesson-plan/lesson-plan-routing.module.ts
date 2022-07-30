import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurriculumComponent } from './curriculum/curriculum.component';
import { LessonPlansListComponent } from './lesson-plan-list/lesson-plan-list.component';
import { CreateLessonPlanComponent } from './create/create-lesson-plan.component';

const lessonPlanRoutes: Routes = [
  {
    path: '',
    children: [
      { path: 'curriculum', component: CurriculumComponent },
      { path: 'list', component: LessonPlansListComponent },
      { path: 'create', component: CreateLessonPlanComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(lessonPlanRoutes), CommonModule],
  exports: [RouterModule],
})
export class LessonPlanRoutingModule {}
