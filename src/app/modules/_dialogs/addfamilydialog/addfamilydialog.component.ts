import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CountriesService } from '../../_services/countries.service';
import { FamilymanagerService } from '../../_services/familymanager.service';
import { ImageManagerService } from '../../_services/image-manager.service';
import { SchoolManagerService } from '../../_services/school-manager.service';
import { DialogServiceService } from '../shared/dialog-service.service';

@Component({
  selector: 'app-addfamilydialog',
  templateUrl: './addfamilydialog.component.html',
  styleUrls: ['./addfamilydialog.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AddfamilydialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddfamilydialogComponent>,
    private countriesservice: CountriesService,
    private imageService: ImageManagerService,
    private customDialog: DialogServiceService,
    private school: SchoolManagerService,
    private familyManager: FamilymanagerService
  ) {}
  fileName = null;

  ParentModel: any = {};

  selectedCar: number;
  genders = this.countriesservice.getGenderList();
  relationships = ['Brother', 'Sister', 'Father', 'Mother'];
  countries = this.countriesservice.getCountries();
  studentCreatedMetaData = null;
  studentCreatedDetails = null;

  ngOnInit(): void {
    this.studentCreatedDetails = this.data.studentCreatedDetails;
    this.studentCreatedMetaData = this.data.studentCreatedMetaData;
    console.log('meta data:');
    console.log(this.studentCreatedMetaData);
    console.log('student data:');

    console.log(this.studentCreatedDetails);
    if (
      this.studentCreatedMetaData == null ||
      this.studentCreatedDetails == null
    ) {
      console.log('unable to retrieve student information');
      this.customDialog.openDialog({
        title: 'Unable to retrieve Student Information.',
        message: 'test',
        confirmText: 'OK',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {
          this.dialogRef.close();
        },
      });
    }
  }
  submitForm(AddFamilyForm: NgForm) {
    const ParentToBeCreated = {
      firstName: this.ParentModel.firstName + '',
      middleName: this.ParentModel.middleName + '',
      lastName: this.ParentModel.lastName + '',
      arabicFirstName: this.ParentModel.arabicFirstName + '',
      arabicMiddleName: this.ParentModel.arabicMiddleName + '',
      arabicLastName: this.ParentModel.arabicLastName + '',
      dateOfBirth: this.ParentModel.dateOfBirth + '',
      placeOfBirth: this.ParentModel.placeOfBirth + '',
      userGender: this.ParentModel.userGender + '',
      password: 'password',
      relationship: this.ParentModel.relationship + '',
      studentId: this.studentCreatedMetaData.student.id,
      logoName:
        this.fileName == null ? null : this.fileName.target.files[0].name,
      // studentId : d6c8fcd3-029d-4da4-af29-5d37bb0833a4
      nationalities: [
        {
          country: this.ParentModel.firstnationality + '',
          passportNumber: this.ParentModel.firstpassportNumber + '',
        },
        {
          country: this.ParentModel.secondnationality + '',
          passportNumber: this.ParentModel.secondpassportNumber + '',
        },
      ],
      email: this.ParentModel.email,
      mobileNumber:
        this.ParentModel.mobileAreaCode + '' + this.ParentModel.mobileNumber,
      phoneNumber:
        this.ParentModel.phoneAreaCode + '' + this.ParentModel.phoneNumber,
      contactDetails: {
        country: this.studentCreatedDetails.contactDetails.country + '',
        address: this.studentCreatedDetails.contactDetails.address + '',
        province: this.studentCreatedDetails.contactDetails.province + '',
        district: this.studentCreatedDetails.contactDetails.district + '',
        city: this.studentCreatedDetails.contactDetails.city + '',
        building: this.studentCreatedDetails.contactDetails.building + '',
        floor: this.studentCreatedDetails.contactDetails.floor + '',
      },
    };
    //Small fix
    if (ParentToBeCreated.nationalities[1].country === undefined) {
      ParentToBeCreated.nationalities[1] = undefined;
    }
    if (ParentToBeCreated.logoName === null) {
      ParentToBeCreated.logoName = 'NULL';
    }
    this.familyManager
      .createParent(ParentToBeCreated, this.school.getCurrentSchoolID())
      .then((CreateResult: any) => {
        if (this.fileName == null) {
          this.customDialog.openDialog({
            title: 'Parent Added successfully. (without image)',
            message: 'test',
            confirmText: 'OK',
            cancelText: 'Cancel',
            oneButton: true,
            DidConfirm: () => {
              this.dialogRef.close(ParentToBeCreated);
            },
          });
          return;
        }
        this.imageService
          .uploadImageParent(CreateResult.imageUpdateLink, this.fileName)
          .then((res) => {
            console.log(CreateResult.imageUpdateLink);
            this.customDialog.openDialog({
              title: 'Parent Added successfully. (with image)',
              message: 'test',
              confirmText: 'OK',
              cancelText: 'Cancel',
              oneButton: true,
              DidConfirm: () => {
                this.dialogRef.close(ParentToBeCreated);
              },
            });
          });
      })
      .catch((err) => {
        console.log(err);
        this.customDialog.openDialog({
          title: 'Please make sure your email is valid and unique.',
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });

    console.log(ParentToBeCreated);
    console.log(JSON.stringify(ParentToBeCreated));
  }

  onFileSelected(event) {
    this.fileName = event;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
