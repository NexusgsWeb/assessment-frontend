import {
  Component,
  ElementRef,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  NgSelectOption,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { contactDetails } from 'src/app/modules/Models/contactDetails';
import { AddfamilydialogComponent } from 'src/app/modules/_dialogs/addfamilydialog/addfamilydialog.component';
import { EditfamilydialogComponent } from 'src/app/modules/_dialogs/editfamilydialog/editfamilydialog.component';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { CountriesService } from 'src/app/modules/_services/countries.service';
import { ImageManagerService } from 'src/app/modules/_services/image-manager.service';
import { Department } from 'src/app/modules/Models/Department';
import { Position } from 'src/app/modules/Models/Position';
import { DepartmentManagerService } from 'src/app/modules/_services/department-manager.service';
import { EmployeeManagerService } from 'src/app/modules/_services/employee-manager.service';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';
import { Employee } from 'src/app/modules/Models/Employee';
import { Router } from '@angular/router';

@Component({
  selector: 'new-employee-application',
  templateUrl: './new-employee-application.component.html',
  styleUrls: ['./new-employee-application.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NewEmployeeApplicationComponent implements OnInit {
  //The Progress for the completion of this form
  Steps = [true, false, false];
  employeeInfoFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  ContactInfo: UntypedFormGroup = new UntypedFormGroup({});
  FamilyGroupFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  //model
  currentEmployee: Employee = new Employee();
  //Section/School
  school_id = '';
  // These are the array data
  genders;
  birthplace;
  nationalities;
  province;
  district;
  city;
  phonenb;
  countries;

  fileName;
  loading = false;

  InputFeedback = 'No Photo Chosen';
  password: string = 'password';
  public test1: string = '';

  departments: any[] = [];
  selectedDeps: Department[] = [];
  positions: Position[] = [];
  selectedPositions: Position[] = [];

  constructor(
    private myElement: ElementRef,
    private customDialog: DialogServiceService,
    private dialog: MatDialog,
    private countryService: CountriesService,
    private imageService: ImageManagerService,
    private departmentManagerService: DepartmentManagerService,
    private employeeManagerService: EmployeeManagerService,
    private authManager: AuthManagerService,
    private router: Router
  ) {}
  intializeForms() {
    this.genders = this.countryService.getGenderList();
    this.birthplace = this.countryService.getBirthPlaceList();
    this.nationalities = this.countryService.getNationalityList();
    this.countries = this.countryService.getCountries();
    this.district = this.countryService.getDistrictList();
    this.city = this.countryService.getCityList();
    this.phonenb = this.countryService.getCodeList();
    //
    this.currentEmployee.nationalities = [];
    this.employeeInfoFormGroup = new UntypedFormGroup({
      employeeNumber: new UntypedFormControl(null, Validators.required),
      joinDate: new UntypedFormControl(null, Validators.required),
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
      departments: new UntypedFormControl(null, Validators.required),
      positions: new UntypedFormControl(null, Validators.required),
      // profilePhoto: new FormControl(this.currentEmployee.profilePhoto),
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
      email: new UntypedFormControl(null, Validators.required),
    });
    // this.FamilyGroupFormGroup = new FormGroup({
    //   firstName: new FormControl(''),
    //   lastName: new FormControl(''),
    // });
  }

  ngOnInit(): void {
    this.school_id = 1 + ''
    // this.school_id = this.authManager.getSchoolId();
    console.log(this.school_id)
    this.getSchoolDeps();
    this.getSchoolPositions();

    this.intializeForms();
  }
  onSubmit(action, index) {
    console.log(this.employeeInfoFormGroup);
    switch (action) {
      case 'Next': {
        console.log(index);
        if (index != 1) {
          const invalid = [];
             const controls = this.employeeInfoFormGroup.controls;
             for (const name in controls) {
                 if (controls[name].invalid) {
                     invalid.push(name);
                 }
             }
             console.log(invalid)
             if(invalid.length > 0){
               for(let param of invalid){
                 this.employeeInfoFormGroup.controls[param].markAsTouched()
               }
               return;
             }

             let country = this.employeeInfoFormGroup.get('country').value;
             let passportid = this.employeeInfoFormGroup.get('passportNumber').value
             console.log(country)
             console.log(passportid)
             if(this.currentEmployee.nationalities.length == 0){
	               if(country != null && passportid != null){
                 if (this.currentEmployee.nationalities.find((x) => x.country === country)) {
                   this.customDialog.openDialog({
                     title: 'Nationality Already Exists.',
                     message: 'test',
                     confirmText: 'OK',
                     cancelText: 'Cancel',
                     oneButton: true,
                     DidConfirm: () => {},
                   });

                   this.currentEmployee.nationalities.push({
                     country: country,
                     passportNumber: passportid,
                   });

                   this.employeeInfoFormGroup.controls['country'].clearValidators();
                   this.employeeInfoFormGroup.controls['country'].updateValueAndValidity();
                   this.employeeInfoFormGroup.controls['passportNumber'].clearValidators();
                   this.employeeInfoFormGroup.controls[
                     'passportNumber'
                   ].updateValueAndValidity();
                   this.employeeInfoFormGroup.controls['nationalities'].clearValidators();
                   this.employeeInfoFormGroup.controls[
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
    console.log(country)
    console.log(this.currentEmployee.nationalities)
    console.log(passportid)
    if (this.currentEmployee.nationalities.find((x) => x.country === country)) {
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
    this.currentEmployee.nationalities.push({
      country: country,
      passportNumber: passportid,
    });
    // this.employeeInfoFormGroup.patchValue({country: null, passportNumber: null});
    // this.employeeInfoFormGroup.patchValue({country: invalid, passportNumber: invalid})
    this.employeeInfoFormGroup.controls['passportNumber'].clearValidators();
    this.employeeInfoFormGroup.controls[
      'passportNumber'
    ].updateValueAndValidity();
    this.employeeInfoFormGroup.controls['nationalities'].clearValidators();
    this.employeeInfoFormGroup.controls[
      'nationalities'
    ].updateValueAndValidity();
    this.employeeInfoFormGroup.updateValueAndValidity();

    this.employeeInfoFormGroup.controls['country'].clearValidators();
    this.employeeInfoFormGroup.controls['country'].updateValueAndValidity();
    // this.employeeInfoFormGroup.controls['passportNumber'].clearValidators();
    // this.employeeInfoFormGroup.controls[
    //   'passportNumber'
    // ].updateValueAndValidity();
    this.employeeInfoFormGroup.controls['nationalities'].clearValidators();
    this.employeeInfoFormGroup.controls[
      'nationalities'
    ].updateValueAndValidity();
  }

  didClickDeleteNationality(country) {
    const copy = this.currentEmployee.nationalities.filter((item) => {
      return !(item.country === country);
    });
    this.currentEmployee.nationalities = copy;
  }
  didClickEditMakeGuardian() {
    this.dialog.open(AddfamilydialogComponent, { autoFocus: false });
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

  async didCompleteForm() {
    console.log(this.currentEmployee);
    console.log(this.employeeInfoFormGroup);

    let mobile = ''
     let phone = ''
     let country = ''
     let birthPlace = ''
     if(this.ContactInfo.get('mobileCode').value != null){
       mobile = this.ContactInfo.get('mobileCode').value.phone
     }
     if(this.ContactInfo.get('phoneCode').value != null){
       phone = this.ContactInfo.get('phoneCode').value.phone
     }
     if(this.ContactInfo.get('country').value != null){
       country = this.ContactInfo.get('country').value.name
     }
     if(this.employeeInfoFormGroup.get('placeOfBirth').value != null){
       birthPlace = this.employeeInfoFormGroup.get('placeOfBirth').value.name
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

    let EmployeeToBeCreated: any = {
      firstName: this.employeeInfoFormGroup.get('firstName').value,
      middleName: this.employeeInfoFormGroup.get('middleName').value,
      lastName: this.employeeInfoFormGroup.get('lastName').value,
      // UserName: this.StudentInfoFormGroup.get('UserName').value,
      arabicFirstName: this.employeeInfoFormGroup.get('arabicFirstName').value,
      arabicMiddleName:
        this.employeeInfoFormGroup.get('arabicMiddleName').value,
      arabicLastName: this.employeeInfoFormGroup.get('arabicLastName').value,
      dateOfBirth: new Date(this.employeeInfoFormGroup.get('dateOfBirth').value).toISOString(),
      placeOfBirth: birthPlace,
      userGender: this.employeeInfoFormGroup.get('userGender').value,
      employeeNumber: this.employeeInfoFormGroup.get('employeeNumber').value,
      departments: this.employeeInfoFormGroup.get('departments').value,
      positions: this.employeeInfoFormGroup.get('positions').value,
      password: 'password',
      joinDate: new Date(this.employeeInfoFormGroup.get('joinDate').value).toISOString(),
      nationalities: this.currentEmployee.nationalities,
      email: this.ContactInfo.get('email').value,
      mobileNumber:
        this.ContactInfo.get('mobileCode').value +
        '' +
        mobile,
      phoneNumber:
        this.ContactInfo.get('phoneCode').value +
        '' +
        phone,
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
    if (this.fileName !== undefined) {
      (EmployeeToBeCreated as any).logoName =
        this.fileName.target.files[0].name;
    }
    console.log(JSON.stringify(EmployeeToBeCreated));
    this.employeeManagerService
      .createEmployeeDittofi(this.school_id, EmployeeToBeCreated, this.selectedDeps, this.selectedPositions)
      .then((res: any) => {
        console.log(res);
        const employeeId = res.data.Id;
        if (this.fileName != undefined) {
          this.imageService
            .uploadImageStudent(res.employeeImageUpdateLink, this.fileName)
            .then((res: string) => {
              console.log(res);
              console.log('Image Uploaded Successfully.');
              EmployeeToBeCreated.logoName = this.fileName.target.files[0];
            });
        }
        // this.departmentManagerService
        //   .assignEmployeeDep(this.school_id, employeeId, this.selectedDeps)
        //   .then((res) => {
        //     console.log(res);
        //   })
        //   .catch((res) => {
        //     console.log(res);
        //   });

        // this.departmentManagerService
        //   .assignEmployeePos(this.school_id, employeeId, this.selectedPositions)
        //   .then((res) => {
        //     console.log(res);
        //   })
        //   .catch((res) => {
        //     console.log(res);
        //   });

        this.customDialog.openDialog({
          title: 'employee has been created.',
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {
            this.router.navigate(['../']);
          },
        });
      })
      .catch((err) => {
        console.log(err);
        this.customDialog.openDialog({
          title:
            'There was an error creating your employee. Possible reason : ' +
            err.error.message,
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }

  addDepartment() {
    const ngSelect = document.getElementById(
      'ngSelect'
    ) as unknown as NgSelectOption;
    return this.test1 + '(new Department)';
  }
  addPosition() {
    const ngSelect = document.getElementById(
      'ngSelect'
    ) as unknown as NgSelectOption;
    return this.test1 + '(new Position)';
  }

  getSchoolDeps() {
    this.departmentManagerService
      .getDepsDittofi(this.school_id)
      .then((res: any) => {
        console.log(res);
        this.departments = res.data;
        console.log(this.departments)
      })
      .catch((res) => {
        console.log(res);
      });
  }

  getSchoolPositions() {
    this.departmentManagerService
      .getPositionsDittofi(this.school_id)
      .then((res: any) => {
        console.log(res);
        this.positions = res.data;
      })
      .catch((res) => {
        console.log(res);
      });
  }
  addTagDepartment = (name) => {
    this.loading = true;
    this.departmentManagerService
      .createDepDittofi(this.school_id, name)
      .then((res: any) => {
        this.departments = [...this.departments, res.data];
        this.loading = false;
      })
      .catch((res) => {
        console.log(res);
        this.loading = false;
        this.customDialog.openDialog({
          title: 'Error while Creating new department ' + name,
          message: 'test',
          confirmText: 'Okay',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  };

  onKey(value) {
    this.selectedDeps = this.search(value);
  }

  addTagPosition = (name) => {
    this.loading = true;
    this.departmentManagerService
      .createPositionDittofi(this.school_id, name)
      .then((res: any) => {
        this.positions = [...this.positions, res.data];

        this.loading = false;
      })
      .catch((res) => {
        console.log(res);
        this.loading = false;
        this.customDialog.openDialog({
          title: 'Error while Creating new position ' + name,
          message: 'test',
          confirmText: 'Okay',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  };

  search(value: string) {
    let filter = value.toLowerCase();
    return this.departments.filter((item) => {
      item.name.toLowerCase().startsWith(filter);
    });
  }
  // addSelected(e){
  //   this.selectedDeps.push(e);
  //   console.log(this.selectedDeps.length)
  // }
  // removeSelected(e){
  //   this.selectedDeps.splice(e.index, 1);
  //   console.log(this.selectedDeps.length)
  // }

  dataModelChanged(e) {
    this.selectedDeps = e;
    console.log(this.selectedDeps);
  }

  posChanged(e) {
    this.selectedPositions = e;
  }
}
