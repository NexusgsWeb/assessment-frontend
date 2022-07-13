import { Component, OnInit } from '@angular/core';
import { School } from '../../../Models/school';

@Component({
  selector: 'app-organization-schools',
  templateUrl: './organization-schools.component.html',
  styleUrls: ['./organization-schools.component.css'],
})
export class OrganizationSchoolsComponent implements OnInit {
  schools: School[] = [];

  constructor() {}

  ngOnInit(): void {}

  getSchoolInfo(schoolId) {}

  expandCollapse(school: School) {}
}
