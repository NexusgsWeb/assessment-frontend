import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssessmentListComponent } from './assessment-list/assessment-list.component';
import { CommonModule } from '@angular/common';
import { QuestionbankComponent } from './questionbank/questionbank.component';
import { CreateAssessmentComponent } from './create-assessment/create-assessment.component';
import { CreatequestionComponent } from './questionbank/createquestion/createquestion.component';
import { AssessmentCreateDetailsComponent } from './create-assessment/assessment-create-details/assessment-create-details.component';
import { LearningObjectivesComponent } from './create-assessment/learning-objectives/learning-objectives.component';
import { AssessmentQuestionsComponent } from './create-assessment/assessment-questions/assessment-questions.component';
import { AssessmentResultsComponent } from './assessment-results/assessment-results.component';
import { ViewAssessmentResultsComponent } from './assessment-results/view-assessment-results/view-assessment-results.component';
import { DisplayAssessmentAnswersComponent } from './assessment-results/display-assessment-answers/display-assessment-answers.component';
import { SAconfigurequestionComponent } from './questionbank/saconfigurequestion/saconfigurequestion.component';
import { AssessmentListStudentComponent } from './assessment-list-student/assessment-list-student.component';
import { AssessmentExamComponent } from './assessment-exam/assessment-exam.component';
import { ResetAssessmentComponent } from './reset-assessment/reset-assessment.component';
import { ImprovemyperformanceStudentComponent } from './improvemyperformance-student/improvemyperformance-student.component';
import { ImprovemyperformanceTeacherComponent } from './improvemyperformance-teacher/improvemyperformance-teacher.component';
import { ContentComponent } from './improvemyperformance-teacher/content/content.component';
import { ViewStudentResultsComponent } from './assessment-results/view-student-results/view-student-results.component';
import { ViewStudentAnswersComponent } from './assessment-results/view-student-answers/view-student-answers.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'improvemyperformance',
        children: [
          { path: 'student', component: ImprovemyperformanceStudentComponent },
          { path: 'teacher', component: ImprovemyperformanceTeacherComponent},
        ],
      },
      { path: 'content', component: ContentComponent, data: {
        breadcrumb: 'Content',
        animation: 'content',
      }, },

      {
        path: 'viewAssessments',
        data: {
          breadcrumb: 'My Assessments',
          animation: 'viewAssessments',
        },
        children: [
          {
            path: '',
            component: AssessmentListComponent,
          },
          {
            path: 'student',
            children: [
              {
                path: '',
                component: AssessmentListStudentComponent,
              },
              {
                path: 'exam',
                children: [
                  { path: '', redirectTo: '123', pathMatch: 'full' },
                  { path: ':id', component: AssessmentExamComponent },
                ],
              },
            ],
          },
          {
            path: 'createAssessment',
            component: CreateAssessmentComponent,
            data: {
              breadcrumb: 'Create Assessment',
              animation: 'createAssessment',
            },
            children: [
              {
                path: '',
                component: AssessmentCreateDetailsComponent,
              },
              {
                path: 'learningObjective',
                component: LearningObjectivesComponent,
                data: {
                  breadcrumb: 'Learning Objective',
                  animation: 'learningObjective',
                },
              },
              {
                path: 'assessmentQuestions',
                component: AssessmentQuestionsComponent,
                data: {
                  breadcrumb: 'Assessment Questions',
                  animation: 'assessmentQuestions',
                },
              },
            ],
          },
        ],
      },

      {
        path: 'viewStudentResults',
        component: ViewStudentResultsComponent,
        data: {
          breadcrumb: 'View Results',
          animation: 'assessmentResults',
        },
      },

      {
        path: 'viewStudentAnswers/:id',
        component: ViewStudentAnswersComponent,
        data: {
          breadcrumb: 'View Answers',
          animation: 'assessmentAnswers',
        },
      },

      {
        path: 'assessmentResults/:id',
        component: AssessmentResultsComponent,
        data: {
          breadcrumb: 'View Results',
          animation: 'assessmentResults',
        },
        children: [
          {
            path: '',
            component: ViewAssessmentResultsComponent,
          },
          {
            path: 'displayAssessmentAnswers',
            component: DisplayAssessmentAnswersComponent,
            data: {
              breadcrumb: 'Display Answers',
              animation: 'displayAssessmentAnswers',
            },
          },
        ],
      },

      {
        path: 'resetAssessment',
        component: ResetAssessmentComponent,
        data: {
          breadcrumb: 'ResetAssessment',
          animation: 'resetAssessment',
        },
      },
    ],
  },
  {
    path: 'questionbank',
    children: [
      {
        path: '',
        component: QuestionbankComponent,
        data: { animation: 'main' },
      },
      {
        path: 'createQuestion',
        children: [
          { path: '', component: CreatequestionComponent },
          {
            path: 'questionSetting/:id',
            component: SAconfigurequestionComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssessmentRoutingModule {}
