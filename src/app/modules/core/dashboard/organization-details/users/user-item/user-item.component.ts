import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SchoolUser } from 'src/app/modules/Models/SchoolUser';
import { ResetpassworddialogComponent } from 'src/app/modules/_dialogs/resetpassworddialog/resetpassworddialog.component';
import { DialogCustomComponent } from 'src/app/modules/_dialogs/shared/dialog-custom/dialog-custom.component';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { ForgetpasswordService } from 'src/app/modules/_services/forgetpassword.service';
import { UserCredentialsService } from 'src/app/modules/_services/user-credentials.service';

@Component({
  selector: '[app-user-item]',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UserItemComponent implements OnInit {
  @Input() user: any;
  editedUser: SchoolUser;
  isBeingEdited: Boolean = false;

  @Input() SelectedToggle = false;
  @Input() organization;

  @Output() didDeleteEventListener = new EventEmitter<SchoolUser>();
  @Output() didEditEventListener = new EventEmitter<any>();
  @Output() didAddtoSelectedUsers = new EventEmitter<any>();
  constructor(
    private passwordResetService: ForgetpasswordService,
    private dialogService: DialogServiceService,
    private userService: UserCredentialsService,
    private dialog: MatDialog,
    private customDialog: DialogServiceService
  ) {}

  ngOnInit(): void {

    console.log('=====================================')
    console.log(this.organization)
    console.log(this.user)
    //Handling null values..
    if (this.user.firstName === null) {
      this.user.firstName = 'null';
    }
    if (this.user.lastName === null) {
      this.user.lastName = 'null';
    }
  }

  handleResetPressed() {
    this.dialog.open(ResetpassworddialogComponent, {
      autoFocus: false,
      data: {
        user_id: this.user.id,
      },
    });
  }
  didPressSelect() {
    this.SelectedToggle = !this.SelectedToggle;
    this.didAddtoSelectedUsers.emit(this.user);
  }
  handleDeactivateActivateUser(user) {
    this.userService
      .deactivateActivateUserDittofi(user.id, !user.is_active)
      .then((res) => {
        console.log(res)
        user.is_active = !user.is_active;
      })
      .catch((err) => {
        console.log(err)
        this.dialogService.openDialog({
          title: 'An error occurred while Activating/Deactivating user.',
          message: '',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }
  handleDeleteUser() {
    this.dialogService.openDialog({
      title: 'Are You Sure You Want to Delete This user?',
      message: '',
      confirmText: 'OK',
      cancelText: 'Cancel',
      oneButton: false,
      DidConfirm: () => {
        this.userService.deleteUser(this.organization.organization.id, this.user.id).then((res) => {
          console.log(res);
          this.didDeleteEventListener.emit(this.user);
        }).catch((res) => {
          this.dialogService.openDialog({
            title: 'An error occurred while Deleting user.',
            message: '',
            confirmText: 'OK',
            cancelText: 'Cancel',
            oneButton: true,
            DidConfirm: () => {},
          });
        });
      },
    });
  }
  didClickEdit() {
    this.editedUser = JSON.parse(JSON.stringify(this.user));
    this.isBeingEdited = true;
  }
  didClickCancel() {
    this.isBeingEdited = false;
  }
  didClickSave() {
    console.log(this.user.id);
    const customUser = {
      firstName: this.editedUser.first_name,
      lastName: this.editedUser.last_name,
      middleName: this.editedUser.middle_name,
      arabicFirstName: this.editedUser.arabic_first_name,
      arabicLastName: this.editedUser.arabic_last_name,
      arabicMiddleName: this.editedUser.arabic_middle_name,
      dateOfBirth: this.editedUser.date_of_birth,
      phoneNumber: this.editedUser.phone_number,
      mobileNumber: this.editedUser.mobile_number,
      placeOfBirth: this.editedUser.place_of_birth,
      email: this.editedUser.email,
      //this should be uncommented when api fix is applied.
      religion: this.editedUser.religion,
      address: this.editedUser.address,
      city: this.editedUser.city,
      building: this.editedUser.building,
      floor: this.editedUser.floor,
      bloodType: this.editedUser.blood_type,
      userGender: this.editedUser.user_gender,
      role_name: this.editedUser.role_name

    };
    console.log(JSON.stringify(customUser));
    let elementsArr = Object.keys(customUser);
    let AllowedToBeEmpty = [
      'logo',
      'schools',
      'isActive',
      'id',
      'updatedAt',
      'middleName',
      '',
    ];
    for (let i = 0; i < elementsArr.length; i++) {
      let currentKeyElement = elementsArr[i];
      let currentKeyValue = customUser[currentKeyElement];
      console.log(currentKeyValue);
      if (AllowedToBeEmpty.includes(currentKeyElement)) {
        continue;
      }
      if (currentKeyValue === null) {
        customUser[currentKeyElement] = 'NULL';
        continue;
      }
      if (currentKeyElement === 'email') {
        //Email Validation
        var re = /\S+@\S+\.\S+/;
        if (!re.test(customUser['email'])) {
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
      if (currentKeyValue.replace(/\s/g, '') == '') {
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
    if (JSON.stringify(this.editedUser) === JSON.stringify(this.user)) {
      console.log('i just saved u a request.');
      this.isBeingEdited = false;
      return;
    }

    this.userService
      .EditUser(this.user.id, JSON.stringify(customUser))
      .then((res) => {
        this.user = JSON.parse(JSON.stringify(this.editedUser));
        this.didEditEventListener.emit();
        this.dialogService.openDialog({
          title: 'User Edited Successfully.',
          message: '',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      })
      .catch((err) => {
        console.log(err)
        this.dialogService.openDialog({
          title: 'An error occurred while editing: ' + err.error.message,
          message: '',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });

    this.isBeingEdited = false;
  }
}
