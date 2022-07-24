import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbModule } from 'angular-crumbs';
import { BlendedLearningRoutingModule } from './blended-learning-routing.module';
import { MyLearningPathComponent } from './my-learning-path/my-learning-path.component';
import { LearningPathCardComponent } from './my-learning-path/learning-path-card/learning-path-card.component';
import { MaterialModule } from 'src/app/material.module';
import { NewLearningPathComponent } from './new-learning-path/new-learning-path.component';
import { LearningPathDetailsComponent } from './new-learning-path/learning-path-details/learning-path-details.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { LearningPathStepsComponent } from './new-learning-path/learning-path-steps/learning-path-steps.component';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { BlendedLearningComponent } from './blended-learning.component';

@NgModule({
  declarations: [
    BlendedLearningComponent,
    MyLearningPathComponent,
    LearningPathCardComponent,
    NewLearningPathComponent,
    LearningPathDetailsComponent,
    LearningPathStepsComponent,
  ],
  imports: [
    BreadcrumbModule,
    CommonModule,
    BlendedLearningRoutingModule,
    MaterialModule,
    MatStepperModule,
    AngularEditorModule,
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
    RouterModule,
  ],
})
export class BlendedLearningModule {}
