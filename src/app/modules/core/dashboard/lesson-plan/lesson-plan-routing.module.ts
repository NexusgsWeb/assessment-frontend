import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurriculumComponent } from './curriculum/curriculum.component';

const lessonPlanRoutes: Routes = [
  {
    path: '',
    children: [{ path: 'curriculum', component: CurriculumComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(lessonPlanRoutes), CommonModule],
  exports: [RouterModule],
})
export class LessonPlanRoutingModule {}
