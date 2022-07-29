import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AuthComponent } from './modules/core/auth/auth.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Router } from '@angular/router';
import {
  SocialLoginModule,
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  MicrosoftLoginProvider,
} from 'angularx-social-login';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ShimmerModule } from '@sreyaj/ng-shimmer';
//angular calendar
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './modules/core/dashboard/dashboard.component';
import { MaterialModule } from './material.module';
import { AddfamilydialogComponent } from './modules/_dialogs/addfamilydialog/addfamilydialog.component';
import { CommonModule, DatePipe } from '@angular/common';
import { EditfamilydialogComponent } from './modules/_dialogs/editfamilydialog/editfamilydialog.component';
import { DialogCustomComponent } from './modules/_dialogs/shared/dialog-custom/dialog-custom.component';
import { MADBtnDirective } from './modules/_directives/mad-btn.directive';
import { ResetpassworddialogComponent } from './modules/_dialogs/resetpassworddialog/resetpassworddialog.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { BreadcrumbModule } from 'angular-crumbs';
import { HttpinterceptorService } from './modules/_services/httpinterceptor.service';
import { AuthModule } from './modules/core/auth/auth.module';
import { MADDirectivesModule } from './modules/_directives/maddirectives.module';
import { NewSchoolComponent } from './modules/_dialogs/new-school/new-school.component';
import { PlaygroundComponent } from './testing/playground/playground.component';

import { MADPipesModule } from './modules/pipes/madpipes.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ViewQuestionDialogComponent } from './modules/_dialogs/assessment/view-question-dialog/view-question-dialog.component';
import { QuestionSettingsDialogComponent } from './modules/_dialogs/question-settings-dialog/question-settings-dialog.component';
import { KatexModule } from 'ng-katex';
import { FeedbackDialogComponent } from './modules/_dialogs/assessment/feedback-dialog/feedback-dialog.component';
import { LearningObjectiveItemComponent } from './modules/_dialogs/question-settings-dialog/learning-objective-item/learning-objective-item.component';
import { QuestionSettingsDialogSaComponent } from './modules/_dialogs/question-settings-dialog-sa/question-settings-dialog-sa.component';
import { QuestionSettingsLebcirComponent } from './modules/_dialogs/question-settings-dialog-sa/question-settings-lebcir/question-settings-lebcir.component';
import { QuestionSettingsUsacirComponent } from './modules/_dialogs/question-settings-dialog-sa/question-settings-usacir/question-settings-usacir.component';
import { QuestionSettingsBricirComponent } from './modules/_dialogs/question-settings-dialog-sa/question-settings-bricir/question-settings-bricir.component';
import { DomainLOItemComponent } from './modules/_dialogs/question-settings-dialog-sa/question-settings-lebcir/domain-loitem/domain-loitem.component';
import { AssessmentComponent } from './modules/core/dashboard/assessment/assessment.component';
import { AssessmentModule } from './modules/core/dashboard/assessment/assessment.module';
import { TruncatePipe } from './pipes/truncate.pipe';
import { ReadMoreModule } from 'ng-readmore';
import { FlatfileAdapterModule } from '@flatfile/angular';
import { MathjaxModule } from 'mathjax-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LessonPlanModule } from './modules/core/dashboard/lesson-plan/lesson-plan.module';
import { ConfirmDialogModule } from './shared/components/confirm-dialog/confirm-dialog.module';
import { BlendedLearningModule } from './modules/core/dashboard/blended-learning/blended-learning.module';
import { LessonPlanComponent } from './modules/core/dashboard/lesson-plan/lesson-plan.component';

@NgModule({
  declarations: [
    AppComponent,
    AddfamilydialogComponent,
    EditfamilydialogComponent,
    DashboardComponent,
    DialogCustomComponent,
    ResetpassworddialogComponent,
    AuthComponent,
    NewSchoolComponent,
    PlaygroundComponent,
    AssessmentComponent,
    ViewQuestionDialogComponent,
    QuestionSettingsDialogComponent,
    FeedbackDialogComponent,
    LearningObjectiveItemComponent,
    QuestionSettingsDialogSaComponent,
    QuestionSettingsLebcirComponent,
    QuestionSettingsUsacirComponent,
    QuestionSettingsBricirComponent,
    DomainLOItemComponent,
    LessonPlanComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    ReadMoreModule,
    FormsModule,
    AppRoutingModule,
    AuthModule,
    RouterModule,
    SocialLoginModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger',
    }),
    NgxPaginationModule,
    NgSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatMomentDateModule,
    MatInputModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    ImageCropperModule,
    BreadcrumbModule,
    ShimmerModule,
    MADDirectivesModule,
    MADPipesModule,
    AssessmentModule,
    LessonPlanModule,
    BlendedLearningModule,
    ConfirmDialogModule,
    AngularEditorModule,
    FormsModule,
    KatexModule,
    FlatfileAdapterModule,
    MathjaxModule.forRoot({
      config: {
        loader: {
          load: ['output/svg', '[tex]/require', '[tex]/ams'],
        },
        tex: {
          inlineMath: [['$', '$']],
          packages: ['base', 'require', 'ams'],
        },
        svg: { fontCache: 'global' },
      },
      src: 'https://cdn.jsdelivr.net/npm/mathjax@3.0.0/es5/startup.js',
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpinterceptorService,
      multi: true,
    },
    DatePipe,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1096722666920-nqudem5r1feclhmabb9suih66b9bp34a.apps.googleusercontent.com'
            ),
          },
          {
            id: MicrosoftLoginProvider.PROVIDER_ID,
            provider: new MicrosoftLoginProvider(
              'bd68a1bb-5e76-4cf7-87d2-aaa49bca0e15',
              {
                // redirect_uri: 'http://localhost:4200/',
                authority: 'https://login.microsoftonline.com/common/',
              }
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
