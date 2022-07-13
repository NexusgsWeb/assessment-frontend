import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgOption, NgSelectComponent } from '@ng-select/ng-select';
import { Router } from 'express';
import { AcademicClass } from 'src/app/modules/Models/AcademicClass';
import { contactDetails } from 'src/app/modules/Models/contactDetails';
import { Cycle } from 'src/app/modules/Models/Cycle';
import { Nationality } from 'src/app/modules/Models/Nationality';
import { Section } from 'src/app/modules/Models/Section';
import { Student } from 'src/app/modules/Models/Student';
import { AddfamilydialogComponent } from 'src/app/modules/_dialogs/addfamilydialog/addfamilydialog.component';
import { EditfamilydialogComponent } from 'src/app/modules/_dialogs/editfamilydialog/editfamilydialog.component';
import { DialogCustomComponent } from 'src/app/modules/_dialogs/shared/dialog-custom/dialog-custom.component';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { AcademicClassService } from 'src/app/modules/_services/academic-class.service';
import { AcademicYearManagerService } from 'src/app/modules/_services/academic-year-manager.service';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';
import { CountriesService } from 'src/app/modules/_services/countries.service';
import { ImageManagerService } from 'src/app/modules/_services/image-manager.service';
import { SchoolManagerService } from 'src/app/modules/_services/school-manager.service';
import { SectionManagerService } from 'src/app/modules/_services/section-manager.service';
import { StudentManagerService } from 'src/app/modules/_services/student-manager.service';

@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class StudentRegistrationComponent implements OnInit {
  @ViewChild('SectionSelector') SectionSelector: NgSelectComponent;
  Steps = [true, false, false];
  StudentInfoFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  ContactInfo: UntypedFormGroup = new UntypedFormGroup({});
  FamilyGroupFormGroup: UntypedFormGroup = new UntypedFormGroup({});

  StudentCreatedReference;
  studentCreatedDetails;
  //model
  currentStudent: Student = new Student();
  // These are the array data
  genders;
  birthplace;
  nationalities;
  province;
  district;
  city;
  phonenb;
  countries = [];
  selectedCountry;

  // These are to represent the new sections/CAYs
  CAYs;

  sections = [];
  //This is used to represent the name
  fileName = null;
  NotFoundText;

  SelectedCAY = null;
  SelectedSection = null;

  InputFeedback = 'No Photo Chosen';
  password: string = 'password';

  MotherFatherReference = {
    firstName: '-',
    middleName: '-',
    lastName: '-',
    nationalities: [],
  };
  constructor(
    private myElement: ElementRef,
    private authService: AuthManagerService,
    private customDialog: DialogServiceService,
    private dialog: MatDialog,
    private countryService: CountriesService,
    private imageService: ImageManagerService,
    private StudentService: StudentManagerService,
    private datePipe: DatePipe,
    private academicYearService: AcademicClassService,
    private SchoolManager: SchoolManagerService,
    private sectionService: SectionManagerService
  ) {}
  intializeForms() {

    this.genders = this.countryService.getGenderList();
    this.birthplace = this.countryService.getBirthPlaceList();
    this.nationalities = this.countryService.getNationalityList();
    this.countries = this.countryService.getCountries();
    // this.province = this.countryService.getProvinceList();
    this.district = this.countryService.getDistrictList();
    this.city = this.countryService.getCityList();
    this.phonenb = this.countryService.getCountries();
    //
    this.currentStudent.nationalities = [];
    this.StudentInfoFormGroup = new UntypedFormGroup({
      studentNumber: new UntypedFormControl(null, Validators.required),
      admissionDate: new UntypedFormControl(null, Validators.required),
      ClassOfAcademicYear: new UntypedFormControl(null, Validators.required),
      sectionId: new UntypedFormControl(null, Validators.required),
      // UserName: new FormControl(null, Validators.required),
      firstName: new UntypedFormControl(null, Validators.required),
      middleName: new UntypedFormControl(null, Validators.required),
      lastName: new UntypedFormControl(null, Validators.required),
      arabicFirstName: new UntypedFormControl(null),
      arabicMiddleName: new UntypedFormControl(null),
	    arabicLastName: new UntypedFormControl(null),
      dateOfBirth: new UntypedFormControl(null, Validators.required),
      placeOfBirth: new UntypedFormControl(null),
      userGender: new UntypedFormControl(null, Validators.required),
      country: new UntypedFormControl(null),
      passportNumber: new UntypedFormControl(null),
      nationalities: new UntypedFormControl(null),
      profilePhoto: new UntypedFormControl(null),
    });
    this.ContactInfo = new UntypedFormGroup({
      country: new UntypedFormControl(null, Validators.required),
      province: new UntypedFormControl(null),
      district: new UntypedFormControl(null),
      city: new UntypedFormControl(null),
      building: new UntypedFormControl(null),
      floor: new UntypedFormControl(null),
      mobileCode: new UntypedFormControl(null),
      mobile: new UntypedFormControl(null),
      phoneCode: new UntypedFormControl(null),
      phone: new UntypedFormControl(null),
	    address: new UntypedFormControl(null),
      email: new UntypedFormControl(null, [Validators.required, Validators.email]),
    });
    // this.FamilyGroupFormGroup = new FormGroup({
    //   firstName: new FormControl(''),
    //   lastName: new FormControl(''),
    // });
  }

  ngOnInit(): void {
    this.intializeForms();
    this.getCAY();
  }

  CreateSection(msg) {
    this.sectionService
      .createSectionDittofi(
        this.SchoolManager.getCurrentSchoolID(),
        this.StudentInfoFormGroup.controls['ClassOfAcademicYear'].value.id,
        {
          code: msg,
        } as Section
      )
      .then((res) => {
        this.customDialog.openDialog({
          title:
            'Section ' +
            msg +
            ' has been created for class ' +
            this.StudentInfoFormGroup.controls['ClassOfAcademicYear'].value
              .name,
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {
            this.SelectedSection = res;
            this.getSectionOfCurrentCAY(res);
          },
        });
      })
      .catch((err) => {
        this.customDialog.openDialog({
          title: 'There was an error creating your section.',
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });

    // this.StudentInfoFormGroup.controls['ClassOfAcademicYear'].value;
  }
  onSubmit(action, index) {
    switch (action) {
      case 'Next': {
        if (index != 1) {
          const invalid = [];
             const controls = this.StudentInfoFormGroup.controls;
             for (const name in controls) {
                 if (controls[name].invalid) {
                     invalid.push(name);
                 }
             }
             console.log(invalid)
             if(invalid.length > 0){
               for(let param of invalid){
                 this.StudentInfoFormGroup.controls[param].markAsTouched()
               }
               return;
             }

             let country = this.StudentInfoFormGroup.get('country').value;
             let passportid = this.StudentInfoFormGroup.get('passportNumber').value
             console.log(country)
             console.log(passportid)
             if(this.currentStudent.nationalities.length == 0){
               if(country != null && passportid != null){
                 if (this.currentStudent.nationalities.find((x) => x.country === country)) {
                   this.customDialog.openDialog({
                     title: 'Nationality Already Exists.',
                     message: 'test',
                     confirmText: 'OK',
                     cancelText: 'Cancel',
                     oneButton: true,
                     DidConfirm: () => {},
                   });

                   this.currentStudent.nationalities.push({
                     country: country,
                     passportNumber: passportid,
                   });

                   this.StudentInfoFormGroup.controls['country'].clearValidators();
                   this.StudentInfoFormGroup.controls['country'].updateValueAndValidity();
                   this.StudentInfoFormGroup.controls['passportNumber'].clearValidators();
                   this.StudentInfoFormGroup.controls[
                     'passportNumber'
                   ].updateValueAndValidity();
                   this.StudentInfoFormGroup.controls['nationalities'].clearValidators();
                   this.StudentInfoFormGroup.controls[
                     'nationalities'
                   ].updateValueAndValidity();

                 }

             }
	           }
          this.Steps[index + 1] = true;
          setTimeout(() => {
            let el = this.myElement.nativeElement.querySelector('.step1');
            el.scrollIntoView();
          }, 50);
          break;
        }

        this.didCompleteForm();
        break;
      }
      case 'Previous': {
        //statements;
        break;
      }
    }
  }
  didClickAddNationality(country, passportid) {
    if (this.currentStudent.nationalities.find((x) => x.country === country)) {
      this.customDialog.openDialog({
        title: 'Nationality Already Exists.',
        message: 'test',
        confirmText: 'OK',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {},
      });

      return;
    }
    this.currentStudent.nationalities.push({
      country: country,
      passportNumber: passportid,
    });
    this.StudentInfoFormGroup.controls['country'].clearValidators();
    this.StudentInfoFormGroup.controls['country'].updateValueAndValidity();
    this.StudentInfoFormGroup.controls['passportNumber'].clearValidators();
    this.StudentInfoFormGroup.controls[
      'passportNumber'
    ].updateValueAndValidity();
    this.StudentInfoFormGroup.controls['nationalities'].clearValidators();
    this.StudentInfoFormGroup.controls[
      'nationalities'
    ].updateValueAndValidity();
  }
  didClickDeleteNationality(country) {
    const copy = this.currentStudent.nationalities.filter((item) => {
      return !(item.country === country);
    });
    this.currentStudent.nationalities = copy;
  }
  didClickEditMakeGuardian() {
    this.dialog
      .open(AddfamilydialogComponent, {
        autoFocus: false,
        data: {
          studentCreatedMetaData: this.StudentCreatedReference,
          studentCreatedDetails: this.studentCreatedDetails,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res === undefined) return;
        this.MotherFatherReference.firstName = res.firstName;
        this.MotherFatherReference.middleName = res.middleName;
        this.MotherFatherReference.lastName = res.lastName;
        res.nationalities.forEach((e) => {
          this.MotherFatherReference.nationalities.push(e.country);
        });
        console.log(res);
      });
  }
  didClickEditDetails() {
    this.dialog.open(EditfamilydialogComponent, { autoFocus: false });
  }
  onFileSelected(event) {
    this.fileName = event;
    try {
      this.InputFeedback = event.target.files[0].name;
    } catch (err) {
      //Avoid unnecessary warning..
    }
  }
  getCAY() {
    this.academicYearService
      .getAllCAYDittofi(this.SchoolManager.getCurrentSchoolID())
      .then((data: any) => {
        console.log(data)
        this.CAYs = data.data;
      })
      .catch((err) => {
        this.customDialog.openDialog({
          title:
            'There was an error retrieving your data.. Please reauthenticate and try again.',
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }
  getSectionOfCurrentCAY(SectionCreated) {
    this.sectionService
      .getSectionsOfCAYDittofi(
        this.SchoolManager.getCurrentSchoolID(),
        SectionCreated.id
      )
      .then((res: any) => {
        console.log(res);
        this.sections = res.data;
        this.StudentInfoFormGroup.controls['sectionId'].setValue(null);

        // this.StudentInfoFormGroup.get('sectionId').setValue(SectionCreated);
        // this.SectionSelector.bindLabel
        // console.log(SectionCreated);
      })
      .catch((err) => console.log(err));
  }
  test() {
    setTimeout(() => {
      let el = this.myElement.nativeElement.querySelector('.top');
      el.scrollIntoView();
    }, 50);
  }
  DidPickCAY(event) {
    console.log(event)
    this.getSectionOfCurrentCAY(event)

  }
  changeDateFormat(date: Date) {
    const newDate = this.datePipe.transform(date, 'dd-MM-yyyy');

    return newDate;
  }

  async didCompleteForm() {
    console.log(this.StudentInfoFormGroup.value);

    let mobile = ''
     let phone = ''
     let country = ''
     let birthPlace = ''
     if(this.ContactInfo.get('mobileCode').value != null){
       mobile = this.ContactInfo.get('mobileCode').value.phone
     }
     if(this.ContactInfo.get('country').value != null){
       country = this.ContactInfo.get('country').value.name
     }
     if(this.StudentInfoFormGroup.get('placeOfBirth').value != null){
       birthPlace = this.StudentInfoFormGroup.get('placeOfBirth').value.name
     }

             const invalid = [];
             const controls = this.ContactInfo.controls;
             for (const name in controls) {
                 if (controls[name].invalid) {
                     invalid.push(name);
                 }
             }

             if(invalid.length > 0){
               for(let name of invalid){
                 this.ContactInfo.controls[name].markAsTouched()
               }
               return;
             }


    let StudentToBeCreated = {
      firstName: this.StudentInfoFormGroup.get('firstName').value,
      middleName: this.StudentInfoFormGroup.get('middleName').value,
      lastName: this.StudentInfoFormGroup.get('lastName').value,
      userName: this.StudentInfoFormGroup.get('studentNumber').value,
      arabicFirstName: this.StudentInfoFormGroup.get('arabicFirstName').value,
      arabicMiddleName: this.StudentInfoFormGroup.get('arabicMiddleName').value,
      arabicLastName: this.StudentInfoFormGroup.get('arabicLastName').value,
      dateOfBirth: new Date(this.StudentInfoFormGroup.get('dateOfBirth').value).toISOString(),
      placeOfBirth: this.StudentInfoFormGroup.get('placeOfBirth').value.name,
      userGender: this.StudentInfoFormGroup.get('userGender').value,
      sectionId: this.StudentInfoFormGroup.get('sectionId').value.Id,
      studentNumber: this.StudentInfoFormGroup.get('studentNumber').value,
      password: this.StudentInfoFormGroup.get('studentNumber').value + '123',
      admissionDate: new Date(this.StudentInfoFormGroup.get('admissionDate').value).toISOString(),

      nationalities: this.currentStudent.nationalities,
      email: this.ContactInfo.get('email').value,
      mobileNumber:
        mobile +
        '' +
        this.ContactInfo.get('mobile').value,
      phoneNumber:
        phone +
        '' +
        this.ContactInfo.get('phone').value,
      contactDetails: {
        country: country,
        address: this.ContactInfo.get('address').value,
        province: this.ContactInfo.get('province').value,
        district: this.ContactInfo.get('district').value,
        city: this.ContactInfo.get('city').value,
        building: this.ContactInfo.get('building').value,
        floor: this.ContactInfo.get('floor').value,
      },
    };
    if (this.fileName !== null) {
      (StudentToBeCreated as any).logoName = this.fileName.target.files[0].name;
    }
    console.log(JSON.stringify(StudentToBeCreated));
    console.log(StudentToBeCreated);

    this.StudentService.CreateStudentDittofi(
      StudentToBeCreated,
      this.SchoolManager.getCurrentSchoolID()
    )
      .then((res: any) => {
        // Info to be passed to the add family
        console.log('DEAR');
        console.log(res);
        this.StudentCreatedReference = res;
        this.studentCreatedDetails = StudentToBeCreated;
        console.log(this.StudentCreatedReference);
        if (this.fileName !== null) {
          console.log(this.fileName);
          this.imageService
            .uploadImageStudent(res.imageUpdateLinkL, this.fileName)
            .then((res: string) => {
              console.log(res);
              console.log('Image Uploaded Successfully.');
            });
        }

        this.Steps = [false, false, true];

        this.customDialog.openDialog({
          title: 'Student has been created.',
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {
            setTimeout(() => {
              let el = this.myElement.nativeElement.querySelector('.top');
              el.scrollIntoView();
            }, 50);
          },
        });
      })
      .catch((err) => {
        console.log(err);
        this.customDialog.openDialog({
          title: 'Your Email Address or Admission number already exist.',
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }

  getCountryStates(event){
    console.log(event)
    this.province = this.countryService.getStatesByCountry(event.shortName)
    this.selectedCountry = event

  }

  getStateCities(event){
    this.city = this.countryService.getCitiesByState(this.selectedCountry.shortName, event)
  }
}
