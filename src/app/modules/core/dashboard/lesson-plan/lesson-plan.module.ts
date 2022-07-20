import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LessonPlanRoutingModule } from './lesson-plan-routing.module';
import { CurriculumComponent } from './curriculum/curriculum.component';
import { LessonPlanComponent } from './lesson-plan.component';
import { StepOneComponent } from './step-one/step-one.component';
import { StepTwoComponent } from './step-two/step-two.component';
import { StepThreeComponent } from './step-three/step-three.component';
import { StepFourComponent } from './step-four/step-four.component';
import { UiModule } from 'src/app/ui-module';

@NgModule({
  declarations: [
    LessonPlanComponent,
    CurriculumComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    StepFourComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiModule,
    LessonPlanRoutingModule,
  ],
})
export class LessonPlanModule {}
