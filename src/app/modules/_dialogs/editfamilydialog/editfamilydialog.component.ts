import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Family } from '../../Models/Family';
import { Nationality } from '../../Models/Nationality';
import { Person } from '../../Models/Person';
import { CountriesService } from '../../_services/countries.service';

@Component({
  selector: 'app-editfamilydialog',
  templateUrl: './editfamilydialog.component.html',
  styleUrls: ['./editfamilydialog.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EditfamilydialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<EditfamilydialogComponent>,
    private countryservice: CountriesService
  ) {}

  //STATIC selectedFamily
  SelectedFamilyEdit: Family = {
    id: 1,
    date: '2021-05-19',
    firstName: 'First Name Test',
    middleName: 'M Name Test',
    lastName: 'L Name Test',
    langFirstName: 'First Name Test',
    langMiddleName: 'First Name Test',
    langLastName: 'First Name Test',
    birthday: '2021-05-19',
    birthplace: 'Beirut',
    gender: 'Female',
    nationalities: [
      {
        country: 'Lebanon',
        passportNumber: '6123',
      },
      {
        country: 'USA',
        passportNumber: '222',
      },
    ],
    profilePhoto: 'phototest',
    country: 'Lebanon',
    province: 'beirut',
    district: 'beirut',
    city: 'beirut',
    building: 'beirut',
    floor: 'beirut',
    mobile: '+96171633209',
    phone: '+444989898989',
    addressDetails: 'test',
    email: 'cookie@cookie.com',
  };

  EditFamilyForm: UntypedFormGroup;
  fileName;
  countries;
  genders = this.countryservice.getGenderList();
  initializeForm() {
    let mobile = this.SelectedFamilyEdit.mobile;
    let phone = this.SelectedFamilyEdit.phone;
    this.EditFamilyForm = new UntypedFormGroup({
      firstName: new UntypedFormControl(this.SelectedFamilyEdit.firstName),
      middleName: new UntypedFormControl(this.SelectedFamilyEdit.middleName),
      lastName: new UntypedFormControl(this.SelectedFamilyEdit.lastName),
      langFirstName: new UntypedFormControl(this.SelectedFamilyEdit.langFirstName),
      langMiddleName: new UntypedFormControl(this.SelectedFamilyEdit.langMiddleName),
      langLastName: new UntypedFormControl(this.SelectedFamilyEdit.langLastName),
      birthday: new UntypedFormControl(this.SelectedFamilyEdit.birthday),
      birthplace: new UntypedFormControl(this.SelectedFamilyEdit.birthplace),
      gender: new UntypedFormControl(this.SelectedFamilyEdit.gender),
      nationality1: new UntypedFormControl(
        this.SelectedFamilyEdit.nationalities[0].country
      ),
      nationality2: new UntypedFormControl(
        this.SelectedFamilyEdit.nationalities[1].country
      ),
      passportID1: new UntypedFormControl(
        this.SelectedFamilyEdit.nationalities[0].passportNumber
      ),
      passportID2: new UntypedFormControl(
        this.SelectedFamilyEdit.nationalities[1].passportNumber
      ),
      phoneCode: new UntypedFormControl(phone.substr(0, 3)),
      phoneNumber: new UntypedFormControl(phone.substr(4)),
      mobileCode: new UntypedFormControl(mobile.substr(0, 3)),
      mobileNumber: new UntypedFormControl(mobile.substr(4)),
      // nationality1: new FormControl("empty"),
      // nationality2: new FormControl( "empty"),
      // passportID1: new FormControl( "empty"),
      // passportID2: new FormControl( "empty"),
      // phoneCode: new FormControl( "empty"),
      // phoneNumber: new FormControl( "empty"),
      // mobileCode: new FormControl( "empty"),
      // mobileNumber: new FormControl( "empty"),
      email: new UntypedFormControl(this.SelectedFamilyEdit.email),
      profilePhoto: new UntypedFormControl(this.SelectedFamilyEdit.profilePhoto),
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.countries = this.countryservice.getCountries();
  }

  submitForm() {
    console.log(this.EditFamilyForm.value);
  }
  testform() {}

  onFileSelected(event) {
    console.log(event);
    this.fileName = event.target.files[0].name;
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
