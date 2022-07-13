import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { AuthComponent } from './modules/core/auth/auth.component';
import { DashboardComponent } from './modules/core/dashboard/dashboard.component';
import { IsAuthAdminGuard } from './modules/guards/is-auth-admin.guard';
import { IsAuthGuard } from './modules/guards/is-auth.guard';
import { PlaygroundComponent } from './testing/playground/playground.component';
import { AssessmentComponent } from './modules/core/dashboard/assessment/assessment.component';
import { CalendarComponent } from './modules/core/dashboard/calendar/calendar.component';
import { LessonPlanComponent } from './modules/core/dashboard/lesson-plan/lesson-plan.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'dev',
    component: PlaygroundComponent,
  },
  {
    path: 'auth',
    component: AuthComponent,
    loadChildren: () =>
      import('./modules/core/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [IsAuthAdminGuard],
  },

  //super admin
  // {
  //   path: 'dashboard',
  //   component: DashboardComponent,
  //   data: { breadcrumb: 'Manage Organizations' },
  //   loadChildren: () =>
  //     import('./modules/core/dashboard/dashboard.module').then(
  //       (m) => m.DashboardModule
  //     ),
  // },
  //schools
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { breadcrumb: 'My Home' },
    loadChildren: () =>
      import('./modules/core/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [IsAuthGuard],
  },
  {
    path: 'assessment',
    component: AssessmentComponent,
    data: { breadcrumb: 'My Home' },
    loadChildren: () =>
      import('./modules/core/dashboard/assessment/assessment.module').then(
        (m) => m.AssessmentModule
      ),
    canActivate: [IsAuthGuard],
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    data: { breadcrumb: 'My Home' },
    loadChildren: () =>
      import('./modules/core/dashboard/calendar/calendar.module').then(
        (m) => m.CalendarModule
      ),
    canActivate: [IsAuthGuard],
  },
  {
    path: 'lesson-plan',
    component: LessonPlanComponent,
    data: { breadcrumb: 'My Home' },
    loadChildren: () =>
      import('./modules/core/dashboard/lesson-plan/lesson-plan.module').then(
        (m) => m.LessonPlanModule
      ),
    canActivate: [IsAuthGuard],
  },

  // {path: 'forgetPass', component: ForgetPassComponent},
  // {path: 'login', component: LoginComponent},
  // {path: 'home', pathMatch: 'full', component: HomeComponent},

  // {path: 'view-school/:id', component: OrganizationSchoolsComponent},
  // {path: 'main', component: MainComponent},
  // {path: 'edit-organization', component: NewOrganizationComponent},
  // {path: 'organization-details', component: OrganizationDetailsComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
