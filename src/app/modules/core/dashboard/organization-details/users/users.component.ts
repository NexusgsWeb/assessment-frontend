import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Organization } from 'src/app/modules/Models/organization';
import { SchoolUser } from 'src/app/modules/Models/SchoolUser';
import { User } from 'src/app/modules/Models/User';
import { DialogCustomComponent } from 'src/app/modules/_dialogs/shared/dialog-custom/dialog-custom.component';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { ForgetpasswordService } from 'src/app/modules/_services/forgetpassword.service';
import { LoadingManagerService } from 'src/app/modules/_services/loading-manager.service';
import { OrganizationsManagerService } from 'src/app/modules/_services/organizations-manager.service';
import { SchoolManagerService } from 'src/app/modules/_services/school-manager.service';
import { UserCredentialsService } from 'src/app/modules/_services/user-credentials.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UsersComponent implements OnInit {
  SelectedUsers: SchoolUser[] = [];
  users: SchoolUser[] = [];
  filteredUsers: SchoolUser[] = [];
  NewUserFormGroup: UntypedFormGroup = new UntypedFormGroup({
    // userName: new FormControl(null, [Validators.required]),
    name: new UntypedFormControl(null, [Validators.required]),
    familyname: new UntypedFormControl(null, Validators.required),
    role: new UntypedFormControl(null, Validators.required),
    email: new UntypedFormControl(null, [Validators.required, Validators.email]),
    phone: new UntypedFormControl(null, Validators.required),

  });

  @Input() SelectedOrganization;

  currentPage = 1;
  isAddingUser = false;

  constructor(
    private OrganizationService: OrganizationsManagerService,
    private customDialog: DialogServiceService,
    public loadingService: LoadingManagerService
  ) {}

  ngOnInit(): void {
    console.log(this.SelectedOrganization.id)
    this.OrganizationService.getAllOrganizationUsersDittofi(
      this.SelectedOrganization.id
    )
      .then((res: any) => {
        console.log(res)
        this.users = res.data;
        this.filteredUsers = res.data;
      })
      .catch((err) => console.log(err));
    console.log(this.users);
  }
  didEditAUser() {
    this.ngOnInit();
  }
  didClickUpload() {
    console.log('Clicked upload.');
  }
  //this method is to fix the problem when switching pagination everything resets.
  CheckIfisSelected(user) {
    return this.SelectedUsers.includes(user);
  }
  didAddAUserToSelected(user: SchoolUser) {
    if (this.SelectedUsers.includes(user)) {
      this.SelectedUsers.splice(this.SelectedUsers.indexOf(user), 1);
      console.log(this.SelectedUsers);
    } else {
      this.SelectedUsers.push(user);
      console.log(this.SelectedUsers);
    }
  }
  didClickDelete(user) {
    console.log('NOTE: this is ONLY deleted locally.');
    this.filteredUsers = this.filteredUsers.filter((orig) => {
      if (user.id === orig.id) {
        return false;
      }
      return true;
    });
  }
  didClickDeleteAll() {
    if (this.SelectedUsers.length == 0) {
      this.customDialog.openDialog({
        title: 'Please select users to delete.',
        message: 'test',
        confirmText: 'OK',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {},
      });
      return;
    }
    const tempSelected = [];

    this.SelectedUsers.map((user) => {
      tempSelected.push(user.id);
    });
    this.OrganizationService.deleteOrganizationUsersBulk(
      this.SelectedOrganization.id,
      tempSelected
    )
      .then((res) => {
        this.filteredUsers = this.filteredUsers.filter((user) => {
          if (!this.SelectedUsers.includes(user)) {
            this.SelectedUsers.splice(this.SelectedUsers.indexOf(user), 1);
            return true;
          }
        });
        this.customDialog.openDialog({
          title: 'Deleted ' + tempSelected.length + ' users successfully.',
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {
            this.ngOnInit();
          },
        });
      })
      .catch((err) => {
        this.customDialog.openDialog({
          title: 'There was an error deleting your users...',
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {
            this.ngOnInit();
          },
        });
      });
  }
  didClickEditOptions() {
    console.log('did Click Edit Logs');
  }
  didSearch(searchInput) {
    this.isAddingUser = false;
    if (searchInput != '') {
      this.currentPage = 1;
      this.filteredUsers = this.users.filter((res) => {
        return res.first_name
          .toLocaleLowerCase()
          .match(searchInput.toLocaleLowerCase());
      });
    } else if (searchInput == '') {
      this.filteredUsers = this.users;
    }
  }
  didClickCancel() {
    this.isAddingUser = false;
  }
  didClickAddUser() {
    this.isAddingUser = true;
    // this.OrganizationService
  }
  didClickSave() {
    let newSchoolUser = {
      // userName: this.NewUserFormGroup.controls['userName'].value,
      first_name: this.NewUserFormGroup.controls['name'].value,
      last_name: this.NewUserFormGroup.controls['familyname'].value,
      middle_name: 'NULL',
      arabic_first_name: 'NULL',
      arabic_last_name: 'NULL',
      arabic_middle_name: 'NULL',
      email: this.NewUserFormGroup.controls['email'].value,
      date_of_birth: '12-12-2099',
      password: 'NULL',
      phone_number: this.NewUserFormGroup.controls['phone'].value,
      mobile_number: 'NULL',
      place_of_birth: 'NULL',
      religion: 'NULL',
      address: 'NULL',
      city: 'NULL',
      building: 'NULL',
      floor: 'NULL',
      blood_type: 'NULL',
      user_gender: 'NotProvided',
      role_name:  this.NewUserFormGroup.controls['role'].value
    };
    console.log(JSON.stringify(newSchoolUser));
    this.OrganizationService.createOrganizationUser(
      this.SelectedOrganization.organization.id,
      newSchoolUser
    )
      .then((res) => {
        this.users.push(newSchoolUser as SchoolUser);
        this.isAddingUser = false;
        this.customDialog.openDialog({
          title: 'User Created successfully.',
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {
            this.ngOnInit();
          },
        });
      })
      .catch((err) => {
        this.customDialog.openDialog({
          title:
            'There was an Error Creating your User. Possible Reason:' +
            err.error.message,
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
    console.log('Did Click Save');
  }
}
