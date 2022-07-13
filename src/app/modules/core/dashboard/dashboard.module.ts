import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { UsersComponent } from './organization-details/users/users.component';
import { OrganizationSchoolsComponent } from './organization-schools/organization-schools.component';
import { MainComponent } from './main/main.component';
import { OrganizationDetailsComponent } from './organization-details/organization-details.component';
import { NewOrganizationComponent } from './new-organization/new-organization.component';
import { AcademicsComponent } from './academics/academics.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material.module';
import { AccessSettingsComponent } from './organization-details/access-settings/access-settings.component';
import { ViewSchoolsComponent } from './organization-details/view-schools/view-schools.component';
import { UserItemComponent } from './organization-details/users/user-item/user-item.component';
import { FocusDirective } from '../../_directives/focus-directive.directive';
import { ViewschoolItemComponent } from './organization-details/view-schools/viewschool-item/viewschool-item.component';
import { OrganizationViewComponent } from './organization-details/organization-view/organization-view.component';
import { StudentRegistrationComponent } from './student-registration/student-registration.component';
import { AdmissionApplicationComponent } from './admission-application/admission-application.component';
import { StudentComponent } from './profile/student/student.component';
import { PersonalDetailsComponent } from './profile/student/personal-details/personal-details.component';
import { ContactDetailsComponent } from './profile/student/contact-details/contact-details.component';
import { FamilyDetailsComponent } from './profile/student/family-details/family-details.component';
import { SchoolPluginItemComponent } from './organization-details/access-settings/school-plugin-item/school-plugin-item.component';
import { SchoolPluginToggleComponent } from './organization-details/access-settings/school-plugin-item/school-plugin-toggle/school-plugin-toggle.component';
import { BreadcrumbModule } from 'angular-crumbs';
import { ShimmerModule } from '@sreyaj/ng-shimmer';
import { SchoolsComponent } from './schools/schools.component';
import { MADDirectivesModule } from '../../_directives/maddirectives.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewEmployeeApplicationComponent } from './new-employee-application/new-employee-application.component';

import { EmployeeApplicationComponent } from './employee-application/employee-application.component';
import { EmployeeComponent } from './profile/employee/employee.component';
import { EmployeeContactDetailsComponent } from './profile/employee/employee-contact-details/employee-contact-details.component';
import { EmployeePersonalDetailsComponent } from './profile/employee/employee-personal-details/employee-personal-details.component';
import { SchoolsDashboardComponent } from './schools-dashboard/schools-dashboard.component';
import { KatexModule } from 'ng-katex';
import { TruncatePipe } from 'src/app/pipes/truncate.pipe';
import { FlatfileAdapterModule } from '@flatfile/angular';

@NgModule({
  declarations: [
    UsersComponent,
    OrganizationSchoolsComponent,
    MainComponent,
    OrganizationDetailsComponent,
    NewOrganizationComponent,
    OrganizationDetailsComponent,
    AcademicsComponent,
    SubjectsComponent,
    AccessSettingsComponent,
    ViewSchoolsComponent,
    UserItemComponent,
    FocusDirective,
    ViewschoolItemComponent,
    OrganizationViewComponent,
    StudentRegistrationComponent,
    AdmissionApplicationComponent,
    StudentComponent,
    PersonalDetailsComponent,
    ContactDetailsComponent,
    FamilyDetailsComponent,
    SchoolPluginItemComponent,
    SchoolPluginToggleComponent,
    SchoolsComponent,
    NewEmployeeApplicationComponent,
    EmployeeApplicationComponent,
    EmployeeComponent,
    EmployeeContactDetailsComponent,
    EmployeePersonalDetailsComponent,
    SchoolsDashboardComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    NgxPaginationModule,
    NgSelectModule,
    ReactiveFormsModule,
    MaterialModule,
    BreadcrumbModule,
    ShimmerModule,
    MADDirectivesModule,
    KatexModule,
    FlatfileAdapterModule,
  ],
})
export class DashboardModule {}
