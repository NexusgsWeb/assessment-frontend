import { Component, OnInit, Inject, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewSchoolComponent } from '../../../_dialogs/new-school/new-school.component';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.css'],
})
export class SchoolsComponent implements OnInit {
  selectedOrganization;
  schoolId: string;
  orgName: string;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.selectedOrganization = this.route.snapshot.data['OrganizationData'];
    this.orgName = this.selectedOrganization.organization.englishName;
    this.schoolId = this.route.snapshot.paramMap.get('school');
  }

  addNewSchoolDialog() {
    this.dialog
      .open(NewSchoolComponent, {
        autoFocus: false,
        data: { organizationId: this.selectedOrganization.organization.id },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result.data != null) {
          const school = result.data;
          this.selectedOrganization.organization.schools.push(school);
        }
      });
  }
}
