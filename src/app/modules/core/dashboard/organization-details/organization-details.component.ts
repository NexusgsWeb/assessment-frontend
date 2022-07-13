import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BreadcrumbService } from 'src/app/modules/_services/breadcrumb.service';
import { OrganizationsManagerService } from 'src/app/modules/_services/organizations-manager.service';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class OrganizationDetailsComponent implements OnInit {
  viewSchoolBool = true;
  viewUsersBool = false;
  viewSettingsBool = false;
  accessSettingsBool = false;

  SelectedOrganization;
  PluginList;
  name: any;

  constructor(private route: ActivatedRoute, private breadcrumbService: BreadcrumbService,  private titleService: Title,
    private organizationManager: OrganizationsManagerService) {}

  ngOnInit(): void {
    this.SelectedOrganization = this.organizationManager.selectedOrganization$.getValue();
    console.log(this.SelectedOrganization)
    this.name = this.SelectedOrganization.english_name

    this.PluginList = this.route.snapshot.data['PluginsData'];
    

    //Default behavior
    this.viewSchoolsClicked();
  }
  

  viewSchoolsClicked() {
    this.viewSchoolBool = true;
    this.viewUsersBool = false;
    this.viewSettingsBool = false;
    this.accessSettingsBool = false;
    // this.defaultPress = false;
  }

  viewUsersClicked() {
    this.viewSchoolBool = false;
    this.viewUsersBool = true;
    this.viewSettingsBool = false;
    this.accessSettingsBool = false;
  }

  AccessSettingsClicked() {
    this.viewSchoolBool = false;
    this.viewUsersBool = false;
    this.viewSettingsBool = false;
    this.accessSettingsBool = true;
  }
}
