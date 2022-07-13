import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { NewOrganizationComponent } from './new-organization/new-organization.component';
import { OrganizationDetailsComponent } from './organization-details/organization-details.component';
import { OrganizationLoadGuard } from '../../guards/organization-load.guard';
import { AdmissionApplicationComponent } from './admission-application/admission-application.component';
import { StudentRegistrationComponent } from './student-registration/student-registration.component';
import { StudentComponent } from './profile/student/student.component';
import { StudentLoadGuard } from '../../guards/student-load.guard';
import { PluginsLoadGuard } from '../../guards/plugins-load.guard';
import { SchoolsComponent } from './schools/schools.component';
import { NewEmployeeApplicationComponent } from './new-employee-application/new-employee-application.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { AcademicsComponent } from './academics/academics.component';
import { EmployeeApplicationComponent } from './employee-application/employee-application.component';
import { EmployeeComponent } from './profile/employee/employee.component';
import { EmployeeLoadGuard } from '../../guards/employee-load.guard';
import { SchoolsDashboardComponent } from './schools-dashboard/schools-dashboard.component';

const routes: Routes = [
  {
    path: 'super',
    component: MainComponent,
    data: { animation: 'main' },
  },

  {
    path: '',
    component: SchoolsDashboardComponent,
    data: { animation: 'main', breadcrumb: 'Home' },
  },

  {
    path: 'academics',
    component: AcademicsComponent,
    data: { animation: 'academics', breadcrumb: 'Manage Academic Settings' },
  },

  {
    path: 'viewOrganization/:id',
    component: OrganizationDetailsComponent,
    data: { breadcrumb: 'View Organizations' },
    // resolve: {
    //   OrganizationData: OrganizationLoadGuard,
    //   PluginsData: PluginsLoadGuard,
    // },
  },

  {
    path: 'viewSchool/:id/:school',
    component: SchoolsComponent,
    data: { breadcrumb: 'View School' },
    resolve: {
      OrganizationData: OrganizationLoadGuard,
      PluginsData: PluginsLoadGuard,
    },
  },

  {
    path: 'newOrganization',
    component: NewOrganizationComponent,
    data: { breadcrumb: 'New Organization', animation: 'newOrganization' },
  },
  {
    path: 'subjects',
    component: SubjectsComponent,
    data: { breadcrumb: 'Manage Subjects', animation: 'subjects' },
  },

  {
    path: 'student',
    children: [
      {
        path: 'admissionApplication',
        data: {
          breadcrumb: 'Admission Application',
          animation: 'admissionApplication',
        },
        children: [
          {
            path: '',
            component: AdmissionApplicationComponent,
            data: {
              breadcrumb: 'Student Registration',
              animation: 'StudentRegistration',
            },
          },

          {
            path: 'studentRegistration',
            component: StudentRegistrationComponent,
            data: {
              breadcrumb: 'Student Registration',
              animation: 'NewStudentRegistration',
            },
          },
        ],
      },

      {
        path: ':SchoolID/:StudentID',
        component: StudentComponent,
        resolve: {
          StudentData: StudentLoadGuard,
        },
        data: {
          breadcrumb: 'StudentProfile',
          animation: 'StudentProfile',
        },
      },
    ],
  },
  {
    path: 'employee',
    children: [
      {
        path: 'employeeApplication',
        data: {
          breadcrumb: 'Employee Application',
          animation: 'EmployeeApplication',
        },
        children: [
          {
            path: '',
            component: EmployeeApplicationComponent,
            data: {
              breadcrumb: 'Employee Application',
              animation: 'EmployeeApplication',
            },
          },
          {
            path: 'newEmployee',
            component: NewEmployeeApplicationComponent,
            data: {
              breadcrumb: 'Employee Registration',
              animation: 'NewEmployeeApplication',
            },
          },
        ],
      },

      {
        path: ':SchoolID/:EmployeeID',
        component: EmployeeComponent,
        resolve: {
          EmployeeData: EmployeeLoadGuard,
        },
        data: {
          breadcrumb: 'EmployeeProfile',
          animation: 'EmployeeProfile',
        },
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
