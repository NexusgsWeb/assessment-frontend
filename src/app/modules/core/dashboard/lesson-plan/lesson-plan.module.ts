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
import { LastStepComponent } from './last-step/last-step.component';
import { UiModule } from 'src/app/ui-module';
import { MADPipesModule } from 'src/app/modules/pipes/madpipes.module'
import { LessonPlansListComponent } from './lesson-plan-list/lesson-plan-list.component';
@NgModule({
  declarations: [
    LessonPlanComponent,
    CurriculumComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    StepFourComponent,
    LastStepComponent,
    LessonPlansListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiModule,
    MADPipesModule,
    LessonPlanRoutingModule,
  ],
})
export class LessonPlanModule {}
