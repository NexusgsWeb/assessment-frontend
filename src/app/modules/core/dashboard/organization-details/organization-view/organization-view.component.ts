import { Component, Input, OnInit } from '@angular/core';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { OrganizationsManagerService } from 'src/app/modules/_services/organizations-manager.service';
import { SchoolManagerService } from 'src/app/modules/_services/school-manager.service';
import { ImgURL } from 'src/app/shared/static_data/apiURL';
import { Organization } from 'src/app/modules/Models/organization';
import { ImageManagerService } from 'src/app/modules/_services/image-manager.service';

@Component({
  selector: 'app-organization-view',
  templateUrl: './organization-view.component.html',
  styleUrls: ['./organization-view.component.css'],
})
export class OrganizationViewComponent implements OnInit {
  @Input() SelectedOrganization;

  organizationEdited: Organization;
  organizations: Organization;
  orgImageFile;
  isBeingEdited: boolean = false;
  duration = '';
  orgLogo: string = 'https://bulma.io/images/placeholders/96x96.png';
  constructor(
    private OrganizationManager: OrganizationsManagerService,
    private customDialog: DialogServiceService,
    private imageService: ImageManagerService
  ) {}

  ngOnInit(): void {
    console.log(this.SelectedOrganization)
    this.organizations = this.OrganizationManager.selectedOrganization$.getValue();
    let durTemp = new Date(this.organizations.license_expiration_date);
    let now = new Date();
    const days = now.getDate() - durTemp.getDate();
    let day = 0;
    let month = 0;
    let year = 0;
    if (day < 0)
    {
        now.setMonth(now.getMonth() - 1);
    }
    month = now.getMonth() - durTemp.getMonth();
    if (month < 0)
    {
        now.setFullYear(durTemp.getFullYear() - 1);
        month += 12;
    }
    year = now.getFullYear() - durTemp.getFullYear();

    if(year == 0 && month == 0){
      this.duration = day + ' days'
    }
    else if(year == 0 && month != 0){
      this.duration = month + ' months'
    }
    else if(year != 0 && month == 0){
      this.duration = year + ' years'
    }
    else if(year != 0 && month != 0){
      this.duration = year + ' years, ' + month + ' months'
    }

    this.organizationEdited = JSON.parse(JSON.stringify(this.organizations));
    if(this.organizations.logo != null){
      const lo = JSON.parse(this.organizations.logo);
      if (lo.length > 0) {
        this.orgLogo = 'https://' + lo[0].url;
      }
      console.log(this.orgLogo)
      console.log(this.organizations)
    }
  

  }


  didPressCancel() {
    this.isBeingEdited = false;
    this.organizationEdited = JSON.parse(JSON.stringify(this.organizations));
  }
  didPressSave() {
    this.isBeingEdited = true;

    if (
      JSON.stringify(this.organizationEdited) ===
      JSON.stringify(this.organizations)
    ) {
      this.isBeingEdited = false;
      return;
    }
    let elementsArr = Object.keys(this.organizationEdited);
    let AllowedToBeEmpty = ['logo', 'schools', 'isActive', 'id', 'updatedAt'];
    for (let i = 0; i < elementsArr.length; i++) {
      let currentKeyElement = elementsArr[i];
      let currentKeyValue = this.organizationEdited[currentKeyElement];

      if (AllowedToBeEmpty.includes(currentKeyElement)) {
        continue;
      }
      //Date Validation
      if (currentKeyElement === 'licenseExpirationDate') {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var date = new Date(currentKeyValue);
        date.setHours(0, 0, 0, 0);
        if (today > date) {
          this.customDialog.openDialog({
            title: 'Please enter a VALID Date.',
            message: 'Please enter a VALID Date.',
            confirmText: 'OK',
            cancelText: 'Cancel',
            oneButton: true,
            DidConfirm: () => {},
          });
          return;
        }
      }
      if (currentKeyElement === 'email') {
        //Email Validation
        var re = /\S+@\S+\.\S+/;
        if (!re.test(this.organizationEdited['email'])) {
          this.customDialog.openDialog({
            title: 'Make sure email is a valid email.',
            message: 'Make sure email is a valid email.',
            confirmText: 'OK',
            cancelText: 'Cancel',
            oneButton: true,
            DidConfirm: () => {},
          });
          return;
        }
      }

      //Empty Validation
      console.log(currentKeyElement)
      if (currentKeyElement == '') {
        this.customDialog.openDialog({
          title: 'FieldName ' + currentKeyElement + ' cannot be empty.',
          message: 'FieldName ' + currentKeyElement + ' cannot be empty.',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
        return;
      }
    }
    console.log(this.organizationEdited)

    this.OrganizationManager.editOrganizationDittofi(this.organizationEdited)
      .then((res : any) => {
        const imageLink = res.imageUpdateLink;
        console.log(this.orgImageFile);
        console.log(imageLink)

        if (imageLink != null) {
          this.imageService
            .uploadImageOrgDittofi(
              this.orgImageFile,
              this.organizationEdited.id
            )
            .then((res) => {
              console.log(res);
              console.log('image uploaded successfully');
            })
            .catch((res) => {
              console.log(res);
            });
        }
        console.log('===================================')
        console.log(res)
        this.customDialog.openDialog({
          title: 'Organization edited successfully',
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
        this.isBeingEdited = false;
        this.organizations = JSON.parse(
          JSON.stringify(this.organizationEdited)
        );
      })
      .catch((res) => {
        console.log(res)
        this.customDialog.openDialog({
          title:
            'Organization Edit Failed .Possible Reason : One of the fields is not unique.',
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }
  handleEditOrganization() {
    this.isBeingEdited = true;
  }
  handleDeactivateActivateSchool() {
    // console.log(this.SelectedOrganization);
    // this.schoolManager
    //   .DeactivateActivateSchool(
    //     this.SelectedOrganization.id,
    //     !this.SelectedOrganization.isActive
    //   )
    //   .then(
    //     (res) =>
    //       (this.SelectedOrganization.isActive =
    //         !this.SelectedOrganization.isActive)
    //   );
  }
  triggerUpload(){
    if(this.isBeingEdited){
      var fileuploader = document.getElementById("fileInput");
      fileuploader.click();
    }
    
    
  }
  onSelectImage(event){
    console.log(event.target.files[0].name);
    this.orgImageFile = event;
    this.organizationEdited.logo = event.target.files[0].name;
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (e : any) => {
      this.orgLogo = e.target.result;
    }
    
  }
}
