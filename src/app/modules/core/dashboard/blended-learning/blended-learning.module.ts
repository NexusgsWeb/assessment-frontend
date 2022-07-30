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

import { LearningPathComponent } from './learning-path/learning-path.component';
import { ContentActivityComponent } from './learning-path/content-activity/content-activity.component';
import { SocialActivityComponent } from './learning-path/social-activity/social-activity.component';
import { EvaluationActivityComponent } from './learning-path/evaluation-activity/evaluation-activity.component';
import { AssessmentActivityComponent } from './learning-path/assessment-activity/assessment-activity.component';
import { EditorialComponent } from './learning-path/content-activity/editorial/editorial.component';
import { NonDigitalResourcesComponent } from './learning-path/content-activity/non-digital-resources/non-digital-resources.component';
import { ExternalWeblinkComponent } from './learning-path/content-activity/external-weblink/external-weblink.component';
import { DigitalResourcesComponent } from './learning-path/content-activity/digital-resources/digital-resources.component';
import { FaceClassroomComponent } from './learning-path/social-activity/face-classroom/face-classroom.component';
import { VirtualClassroomComponent } from './learning-path/social-activity/virtual-classroom/virtual-classroom.component';
import { SocialExternalWeblinkComponent } from './learning-path/social-activity/social-external-weblink/social-external-weblink.component';
import { OnlineDiscussionComponent } from './learning-path/social-activity/online-discussion/online-discussion.component';
import { AudioRecordingComponent } from './learning-path/content-activity/audio-recording/audio-recording.component';
import { HomeworkComponent } from './learning-path/evaluation-activity/homework/homework.component';
import { LearningAssessmentComponent } from './learning-path/evaluation-activity/learning-assessment/learning-assessment.component';
import { EvaluationExternalWeblinkComponent } from './learning-path/evaluation-activity/evaluation-external-weblink/evaluation-external-weblink.component';
import { ClassworkComponent } from './learning-path/evaluation-activity/classwork/classwork.component';
import { HomeworkActivityComponent } from './learning-path/assessment-activity/homework-activity/homework-activity.component';
import { OnlineAssessmentComponent } from './learning-path/assessment-activity/online-assessment/online-assessment.component';
import { AssessmentExternalWeblinkComponent } from './learning-path/assessment-activity/assessment-external-weblink/assessment-external-weblink.component';
import { ClassworkActivityComponent } from './learning-path/assessment-activity/classwork-activity/classwork-activity.component';
import { MatCardModule } from '@angular/material/card';
import { UiModule } from 'src/app/ui-module';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [
    MyLearningPathComponent,
    LearningPathCardComponent,
    NewLearningPathComponent,
    LearningPathDetailsComponent,
    LearningPathStepsComponent,
    LearningPathComponent,
    ContentActivityComponent,
    SocialActivityComponent,
    EvaluationActivityComponent,
    AssessmentActivityComponent,
    EditorialComponent,
    NonDigitalResourcesComponent,
    ExternalWeblinkComponent,
    DigitalResourcesComponent,
    FaceClassroomComponent,
    VirtualClassroomComponent,
    SocialExternalWeblinkComponent,
    OnlineDiscussionComponent,
    AudioRecordingComponent,
    HomeworkComponent,
    LearningAssessmentComponent,
    EvaluationExternalWeblinkComponent,
    ClassworkComponent,
    HomeworkActivityComponent,
    OnlineAssessmentComponent,
    AssessmentExternalWeblinkComponent,
    ClassworkActivityComponent,
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
    MatGridListModule,
  ],
})
export class BlendedLearningModule {}
