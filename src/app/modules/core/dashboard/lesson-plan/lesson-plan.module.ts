import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LessonPlanRoutingModule } from './lesson-plan-routing.module';
import { CurriculumComponent } from './curriculum/curriculum.component';
import { UiModule } from 'src/app/ui-module';

@NgModule({
  declarations: [CurriculumComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiModule,
    LessonPlanRoutingModule,
  ],
})
export class LessonPlanModule {}
