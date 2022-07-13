import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssessmentRoutingModule } from './assessment-routing.module';
import { AssessmentListComponent } from './assessment-list/assessment-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'angular-crumbs';
import { CountdownModule } from 'ngx-countdown';

import { FormsModule } from '@angular/forms';
import { QuestionbankComponent } from './questionbank/questionbank.component';
import { QuestionbankrowComponent } from './questionbank/questionbankrow/questionbankrow.component';
import { CreateAssessmentComponent } from './create-assessment/create-assessment.component';
import { CreatequestionComponent } from './questionbank/createquestion/createquestion.component';
import { MADQuestionMCQComponent } from './questionbank/createquestion/madquestion-mcq/madquestion-mcq.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MADQuestionMCQoptionComponent } from './questionbank/createquestion/madquestion-mcq/madquestion-mcqoption/madquestion-mcqoption.component';
import { MADQuestionTFComponent } from './questionbank/createquestion/MADQuestionTF/madquestion-tf/madquestion-tf.component';
import { MADQuestionDateComponent } from './questionbank/createquestion/MADQuestionDate/madquestion-date.component';
import { MADQuestionDescriptiveComponent } from './questionbank/createquestion/MADQuestionDescriptive/madquestion-descriptive.component';
import { MADQuestionNumberComponent } from './questionbank/createquestion/MADQuestionNumber/madquestion-number.component';
import { MADQuestionNumberOptionComponent } from './questionbank/createquestion/MADQuestionNumber/madquestion-number-option/madquestion-number-option.component';
import { MADQuestionShortTextComponent } from './questionbank/createquestion/MADQuestionShortText/madquestion-short-text.component';
import { MADQuestionBlanksComponent } from './questionbank/createquestion/MADQuestionBlanks/madquestion-blanks.component';
import { MatStepperModule } from '@angular/material/stepper';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AssessmentCreateDetailsComponent } from './create-assessment/assessment-create-details/assessment-create-details.component';
import { LearningObjectivesComponent } from './create-assessment/learning-objectives/learning-objectives.component';
import { AssessmentQuestionsComponent } from './create-assessment/assessment-questions/assessment-questions.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { KatexModule } from 'ng-katex';
import { ReviewAssessmentComponent } from './create-assessment/review-assessment/review-assessment.component';

import { AssessmentResultsComponent } from './assessment-results/assessment-results.component';
import { ViewAssessmentResultsComponent } from './assessment-results/view-assessment-results/view-assessment-results.component';
import { DisplayAssessmentAnswersComponent } from './assessment-results/display-assessment-answers/display-assessment-answers.component';
import { QuestionBankFiltersComponent } from './questionbank/question-bank-filters/question-bank-filters.component';
import { SAconfigurequestionComponent } from './questionbank/saconfigurequestion/saconfigurequestion.component';
import { AssessmentListStudentComponent } from './assessment-list-student/assessment-list-student.component';
import { AssessmentListStudentItemComponent } from './assessment-list-student/assessment-list-student-item/assessment-list-student-item.component';
import { ExamPageTemplateComponent } from './assessment-exam/exam-page-template/exam-page-template.component';
import { AssessmentExamComponent } from './assessment-exam/assessment-exam.component';
import { IntroPageComponent } from './assessment-exam/intro-page/intro-page.component';
import { TimerComponent } from './assessment-exam/exam-page-template/timer/timer.component';
import { QuestionbubbleComponent } from './assessment-exam/exam-page-template/questionbubble/questionbubble.component';
import { MadquestionMcqAssessComponent } from './assessment-exam/questions/madquestion-mcq-assess/madquestion-mcq-assess.component';
import { MadquestionmcqassessChoiceComponent } from './assessment-exam/questions/madquestion-mcq-assess/madquestionmcqassess-choice/madquestionmcqassess-choice.component';
import { MadquestionTfAssessComponent } from './assessment-exam/questions/madquestion-tf-assess/madquestion-tf-assess.component';
import { MadquestionDescriptiveAssessComponent } from './assessment-exam/questions/madquestion-descriptive-assess/madquestion-descriptive-assess.component';
import { MadquestionShorttextAssessComponent } from './assessment-exam/questions/madquestion-shorttext-assess/madquestion-shorttext-assess.component';
import { MadquestionNumberAssessComponent } from './assessment-exam/questions/madquestion-number-assess/madquestion-number-assess.component';
import { MadquestionDateAssessComponent } from './assessment-exam/questions/madquestion-date-assess/madquestion-date-assess.component';
import { MadquestionBlanksAssessComponent } from './assessment-exam/questions/madquestion-blanks-assess/madquestion-blanks-assess.component';
import { ReviewQuestionsComponent } from './assessment-exam/review-questions/review-questions.component';
import { SAconfigurequestionREMARKITEMComponent } from './questionbank/saconfigurequestion/saconfigurequestion-remarkitem/saconfigurequestion-remarkitem.component';
import { ResetAssessmentComponent } from './reset-assessment/reset-assessment.component';
import { MADPipesModule } from 'src/app/modules/pipes/madpipes.module';
import { MADDirectivesModule } from 'src/app/modules/_directives/maddirectives.module';
import { TruncatePipe } from 'src/app/pipes/truncate.pipe';
import { MADQuestionMCQEditComponent } from './questionbank/saconfigurequestion/questions/madquestion-mcqedit/madquestion-mcqedit.component';
import { MADQuestionDescriptiveEditComponent } from './questionbank/saconfigurequestion/questions/madquestion-descriptive-edit/madquestion-descriptive-edit.component';
import { MADQuestionBlanksEditComponent } from './questionbank/saconfigurequestion/questions/madquestion-blanks-edit/madquestion-blanks-edit.component';
import { MADQuestionTFEditComponent } from './questionbank/saconfigurequestion/questions/madquestion-tfedit/madquestion-tfedit.component';
import { MADQuestionShortTextEditComponent } from './questionbank/saconfigurequestion/questions/madquestion-short-text-edit/madquestion-short-text-edit.component';
import { MADQuestionNumberEditComponent } from './questionbank/saconfigurequestion/questions/madquestion-number-edit/madquestion-number-edit.component';
import { MADQuestionDateEditComponent } from './questionbank/saconfigurequestion/questions/madquestion-date-edit/madquestion-date-edit.component';
import { MADQuestionEditMCQOptionComponent } from './questionbank/saconfigurequestion/questions/madquestion-mcqedit/madquestion-edit-mcqoption/madquestion-edit-mcqoption.component';
import { ImprovemyperformanceStudentComponent } from './improvemyperformance-student/improvemyperformance-student.component';
import { ImprovemyperformanceTeacherComponent } from './improvemyperformance-teacher/improvemyperformance-teacher.component';
import { LOItemIMPComponent } from './improvemyperformance-student/loitem-imp/loitem-imp.component';
import { LOItemIMPTComponent } from './improvemyperformance-teacher/loitem-impt/loitem-impt.component';
import { StudItemIMPTComponent } from './improvemyperformance-teacher/stud-item-impt/stud-item-impt.component';
import { ContentComponent } from './improvemyperformance-teacher/content/content.component';
import { ReadMoreModule } from 'ng-readmore';
import { ViewStudentResultsComponent } from './assessment-results/view-student-results/view-student-results.component';
import { ViewStudentAnswersComponent } from './assessment-results/view-student-answers/view-student-answers.component';
import { PercentageComponent } from './assessment-exam/exam-page-template/percentage/percentage.component'
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MathjaxModule } from 'mathjax-angular';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    AssessmentListComponent,
    QuestionbankComponent,
    QuestionbankrowComponent,
    CreateAssessmentComponent,
    CreatequestionComponent,
    MADQuestionMCQComponent,
    MADQuestionMCQoptionComponent,
    MADQuestionTFComponent,
    MADQuestionDescriptiveComponent,
    MADQuestionDateComponent,
    MADQuestionNumberComponent,
    MADQuestionNumberOptionComponent,
    MADQuestionShortTextComponent,
    MADQuestionBlanksComponent,
    LearningObjectivesComponent,
    AssessmentCreateDetailsComponent,
    QuestionBankFiltersComponent,
    AssessmentQuestionsComponent,
    ReviewAssessmentComponent,
    ViewAssessmentResultsComponent,
    DisplayAssessmentAnswersComponent,
    AssessmentResultsComponent,
    SAconfigurequestionComponent,
    SAconfigurequestionREMARKITEMComponent,
    AssessmentListStudentComponent,
    AssessmentListStudentItemComponent,
    ExamPageTemplateComponent,
    AssessmentExamComponent,
    IntroPageComponent,
    TimerComponent,
    QuestionbubbleComponent,
    MadquestionMcqAssessComponent,
    MadquestionmcqassessChoiceComponent,
    MadquestionTfAssessComponent,
    MadquestionDescriptiveAssessComponent,
    MadquestionShorttextAssessComponent,
    MadquestionNumberAssessComponent,
    MadquestionDateAssessComponent,
    MadquestionBlanksAssessComponent,
    ReviewQuestionsComponent,
    ResetAssessmentComponent,
    ImprovemyperformanceStudentComponent,
    ImprovemyperformanceTeacherComponent,
    LOItemIMPComponent,
    LOItemIMPTComponent,
    StudItemIMPTComponent,
    TruncatePipe,
    MADQuestionMCQEditComponent,
    MADQuestionDescriptiveEditComponent,
    MADQuestionBlanksEditComponent,
    MADQuestionTFEditComponent,
    MADQuestionShortTextEditComponent,
    MADQuestionNumberEditComponent,
    MADQuestionDateEditComponent,
    MADQuestionEditMCQOptionComponent,
    ContentComponent,
    ViewStudentResultsComponent,
    ViewStudentAnswersComponent,
    PercentageComponent,
  ],
  imports: [
    CommonModule,
    ReadMoreModule,
    FlexLayoutModule,
    AssessmentRoutingModule,
    NgxPaginationModule,
    NgSelectModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    MADDirectivesModule,
    AngularEditorModule,
    MatStepperModule,
    ScrollingModule,
    MADPipesModule,
    CountdownModule,
    NgxChartsModule,
    NgxEchartsModule.forRoot({
      /**
       * This will import all modules from echarts.
       * If you only need custom modules,
       * please refer to [Custom Build] section.
       */
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),

    MathjaxModule.forRoot({
      "config": {
        "loader": {
          "load": ["output/svg", "[tex]/require", "[tex]/ams"]
        },
        "tex": {
          "inlineMath": [["$", "$"]],
          "packages": ["base", "require", "ams"]
        },
        "svg": { "fontCache": "global" }
      },
      "src": "https://cdn.jsdelivr.net/npm/mathjax@3.0.0/es5/startup.js"
    }),
    KatexModule,
  ],
  exports: [AssessmentCreateDetailsComponent],
})
export class AssessmentModule {}
