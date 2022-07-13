import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Organization } from 'src/app/modules/Models/organization';
import { OrganizationsManagerService } from 'src/app/modules/_services/organizations-manager.service';
import { SchoolManagerService } from 'src/app/modules/_services/school-manager.service';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { School } from 'src/app/modules/Models/school';
import { LoadingManagerService } from 'src/app/modules/_services/loading-manager.service';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit {



  organizations: Organization[] = [];
  newOrganizationImage = 'assets/images/newOrganization.png';

  constructor(
    public loadingService: LoadingManagerService,
    private organizationManager: OrganizationsManagerService,
    private schoolService: SchoolManagerService,
    private DialogSerivce: DialogServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getOrganizations();
  }
  showDialog() {
    this.DialogSerivce.openDialog({
      title: 'TITLE DIALOG',
      message: 'MESSAGE DIALOG',
      confirmText: 'confirm DIALOG',
      cancelText: 'Cancel DIALOG',
      oneButton: false,
      DidConfirm: () => {
        console.log('hello from the outside');
      },
    });
  }
  getOrganizations() {
    this.organizationManager
      .getAllOrganizationsDittofi()
      .then((res: any) => {
        console.log(res)
        this.organizations = res.data;

        let tempSchools = [];
        for(let i =0 ;i < this.organizations.length; i++){
          for(let j =0; j< this.organizations[i].schools.length; j++){
            if(this.organizations[i].schools[j].id != 0){
              tempSchools.push(this.organizations[i].schools[j]);
            }
          }
          this.organizations[i].schools = tempSchools;
          tempSchools = [];
        }
      })
      .catch((err) => {
        console.log(err)
        this.DialogSerivce.openDialog({
          title:
            err.error.error,
          message: 'MESSAGE DIALOG',
          confirmText: 'Ok',
          cancelText: 'Cancel DIALOG',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }
  sortSchoolForAll(schools) {
    return schools.sort((a, b) => a.isActive - b.isActive);
  }
  HandleSchoolActivationToggle(school_id, organization_id) {
    const OrganizationElement: Organization = this.organizations.find(
      ({ id }) => id == organization_id
    );
    const OrganizationElementIndex = this.organizations.findIndex(
      (a) => a.id == organization_id
    );
    const SchoolIndex = OrganizationElement.schools.findIndex(
      (a) => a.id == school_id
    );
    const currentToggle = OrganizationElement.schools[SchoolIndex].is_active;
    this.schoolService
      .DeactivateActivateSchoolDittofi(school_id, !currentToggle)
      .then((res) => {
        this.organizations[OrganizationElementIndex].schools[
          SchoolIndex
        ].is_active = !currentToggle;
        const SortedSchools: School[] = this.sortSchoolForAll(
          this.organizations[OrganizationElementIndex].schools
        );
        this.organizations[OrganizationElementIndex].schools = SortedSchools;
        console.log(
          'School with ID ' +
            school_id +
            ' belonging to Organization ' +
            organization_id +
            ' has been deleted.'
        );
      })
      .catch((err) =>
        console.log("Couldn't Deactivate School. Reason: " + err.message)
      );
  }
  HandleDeleteOrganization(organization_id) {
    this.DialogSerivce.openDialog({
      title: 'Are you sure you want to delete this organization?',
      message: 'test',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      oneButton: false,
      DidConfirm: () => {
        this.organizationManager
          .deleteOrganizationDittofi(organization_id)
          .then((res) => {
            console.log(res);
            this.DialogSerivce.openDialog({
              title: 'Organization Deleted Sucessfully.',
              message: 'MESSAGE DIALOG',
              confirmText: 'Ok',
              cancelText: 'Cancel DIALOG',
              oneButton: true,
              DidConfirm: () => {},
            });

            const ElementToBeDeleted: Organization = this.organizations.find(
              ({ id }) => id == organization_id
            );
            this.organizations.splice(
              this.organizations.findIndex(
                (a) => a.id == ElementToBeDeleted.id
              ),
              1
            );
          })
          .catch((res) => {
            console.log(res);
            this.DialogSerivce.openDialog({
              title:
                'There was an error loading deleting your organization, Please try again later.',
              message: 'MESSAGE DIALOG',
              confirmText: 'Ok',
              cancelText: 'Cancel DIALOG',
              oneButton: true,
              DidConfirm: () => {},
            });
          });
      },
    });
  }
  handleViewOrganization(organization) {
    // uncomment this when its routing is configured
    this.organizationManager.selectedOrganization$.next(organization);
    this.router.navigate(['../viewOrganization', organization.id], {
      relativeTo: this.route,
    });
  }
  handleViewSchool(organizationId: string, schoolId: string) {
    this.router.navigate(['viewSchool', organizationId, schoolId], {
      relativeTo: this.route,
    });

    // uncomment this when its routing is configured
    // this.router.navigate(['/view-organization',school_id]);
  }
}
