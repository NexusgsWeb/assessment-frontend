import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { School } from 'src/app/modules/Models/school';
import { SchoolManagerService } from 'src/app/modules/_services/school-manager.service';
import { ImageManagerService } from 'src/app/modules/_services/image-manager.service';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-new-school',
  templateUrl: './new-school.component.html',
  styleUrls: ['./new-school.component.css']
})
export class NewSchoolComponent implements OnInit {
  schoolCredentials = new School();
  @Output() didAddSchoolListener = new EventEmitter<any>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: {organizationId: string}, private dialogRef: MatDialogRef<NewSchoolComponent>,
  private schoolManager: SchoolManagerService, private imageService: ImageManagerService, 
    private dialogService: DialogServiceService) { }

  ngOnInit(): void {
    console.log(this.data.organizationId)
    this.schoolCredentials.organization_id = this.data.organizationId;
  }

  createSchool() {

      this.schoolManager
        .createSchoolDittofi(this.schoolCredentials)
        .then((data: any) => {
          console.log('schools schools');
          console.log('school: ' + this.schoolCredentials);
          
          const newSchool = data.school;

          if (data.imageUpdateLink != null) {
            const imageurl = data.imageUpdateLink;
            this.imageService
              .uploadImageOrg(this.schoolCredentials.image_uploaded, imageurl)
              .then((res) => {
                console.log(res);
                console.log('school image uploaded successfully');
                console.log(newSchool);

                // this.didAddSchoolListener.emit('hello');
                this.dialogRef.close({
                  message: 'Confirm',
                  data: newSchool});

              })
              .catch((res) => {
                console.log(res);
              });
          }
        })
        .catch((res) => {
          console.log(res)
          this.dialogService.openDialog({
            title: res.error.message,
            message: '',
            confirmText: 'OK',
            cancelText: 'Cancel',
            oneButton: true,
            DidConfirm: () => {},
          });
        });
    
  }

  closeDialog(){
    this.dialogRef.close({
      message: 'Confirm',
      data: null});
  }

  onSelectFileImage(e) {
    this.schoolCredentials.image_uploaded = e;
    const name = e.target.files[0].name;
    if(name != null && name != ''){
    this.schoolCredentials.logo = e.target.files[0].name;

    }
  }
 

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  



}
