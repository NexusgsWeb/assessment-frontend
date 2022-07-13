import {
  Component,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { SchoolManagerService } from 'src/app/modules/_services/school-manager.service';
import { ImgURL } from 'src/app/shared/static_data/apiURL';
import { School } from 'src/app/modules/Models/school';
import { ImageManagerService } from 'src/app/modules/_services/image-manager.service';

@Component({
  selector: 'app-viewschool-item',
  templateUrl: './viewschool-item.component.html',
  styleUrls: ['./viewschool-item.component.css'],
})
export class ViewschoolItemComponent implements OnInit {
  @Input() school;
  @Input() SelectedOrganization;
  @Input() schoolId;
  @Output() didDeleteSchoolListener = new EventEmitter<School>();
  @ViewChild(MatExpansionPanel, { static: true })
  matExpansionPanelElement: MatExpansionPanel;
  EditedSchool;
  isBeingEdited: boolean = false;
  schoolLogo: string = 'https://bulma.io/images/placeholders/96x96.png';
  expand: boolean = false;
  checkExpanded: boolean = false;
  constructor(
    private schoolManager: SchoolManagerService,
    private customDialog: DialogServiceService,
    private imageService: ImageManagerService
  ) {}

  ngOnInit(): void {
    if (this.school.logo != null) {
      this.schoolLogo = ImgURL + this.school.logo;
    }
    if (this.school.id == this.schoolId) {
      this.expand = true;
      this.checkExpanded = true;
    } else {
      this.expand = false;
    }
  }

  didPressCancel() {
    this.isBeingEdited = false;
  }
  didPressSave() {
    console.log(this.EditedSchool);
    this.school.activePlugins = undefined;
    this.EditedSchool.activePlugins = undefined;
    if (JSON.stringify(this.EditedSchool) === JSON.stringify(this.school)) {
      console.log('i just saved u a request.');
      this.isBeingEdited = false;
      return;
    }

    // Local Validation to avoid unnecessary requests.
    let elementsArr = Object.keys(this.EditedSchool);
    let AllowedToBeEmpty = [
      'logo',
      'updatedAt',
      'isActive',
      'createdAt',
      'activePlugins',
      'id',
      'imageUploaded',
      'organizationId',
    ];
    for (let i = 0; i < elementsArr.length; i++) {
      let currentKeyElement = elementsArr[i];
      let currentKeyValue = this.EditedSchool[currentKeyElement];
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
        if (!re.test(this.EditedSchool['email'])) {
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
      if (currentKeyElement != 'imageUploaded') {
        if (currentKeyValue == '') {
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
    }

    this.schoolManager
      .editSchoolDittofi(this.EditedSchool)
      .then((res: any) => {
        console.log(res);
        if (res.imageUpdateLink != null) {
          this.imageService
            .uploadImageOrg(
              this.EditedSchool.imageUploaded,
              res.imageUpdateLink
            )
            .then((res) => {
              console.log(res);
              console.log('image uploaded successfully');
            })
            .catch((res) => {
              console.log(res);
            });
        }
        this.customDialog.openDialog({
          title: 'Edited School Successful.',
          message: 'Edited School Successful.',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
        this.school = JSON.parse(JSON.stringify(this.EditedSchool));
        this.isBeingEdited = false;
      })
      .catch((res) => {
        console.log(res);
        this.customDialog.openDialog({
          title: 'Edited School Failed. Reason ' + res.error.message,
          message: 'Edited School Failed',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
    //Api
  }
  async handleEditSchool() {
    this.EditedSchool = await JSON.parse(JSON.stringify(this.school));
    console.log(this.EditedSchool);
    this.isBeingEdited = !this.isBeingEdited;
    if (this.checkExpanded) {
      this.expand = false;
    }

    if (this.expand == false) {
      this.expand = true;
      this.matExpansionPanelElement.open();
    }
  }
  handleDeactivateActivateSchool() {
    this.schoolManager
      .DeactivateActivateSchoolDittofi(this.school.id, !this.school.isActive)
      .then((res) => (this.school.isActive = !this.school.isActive));
  }

  onImageError() {
    this.schoolLogo = 'https://bulma.io/images/placeholders/96x96.png';
  }
  handleDeleteSchool(schoolId: string) {
    this.customDialog.openDialog({
      title: 'Are you sure you want to delete this school?',
      message: 'test',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      oneButton: false,
      DidConfirm: () => {
        this.schoolManager
          .deleteSchoolDittofi(schoolId)
          .then((res) => {
            this.customDialog.openDialog({
              title: 'School was deleted successfully',
              message: 'MESSAGE DIALOG',
              confirmText: 'Ok',
              cancelText: 'Cancel DIALOG',
              oneButton: true,
              DidConfirm: () => {},
            });

            this.didDeleteSchoolListener.emit(this.school);
          })
          .catch((res) => {
            if (res.status === 400) {
              console.log('Cannot Delete Academic year');
            } else {
              console.log(res);
            }
          });
      },
    });
  }
  triggerUpload1() {
    console.log('triggered');
    if (this.isBeingEdited) {
      var fileuploader = document.getElementById('fileInput1');
      fileuploader.click();
    }
  }
  async selectImage(event) {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = async (e: any) => {
      this.schoolLogo = await e.target.result;
      console.log('done?');
      this.EditedSchool.imageUploaded = await event;
      this.EditedSchool.logo = await event.target.files[0].name;
    };
  }
}
