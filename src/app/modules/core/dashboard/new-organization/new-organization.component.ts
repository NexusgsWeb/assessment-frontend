import { Component, OnInit } from '@angular/core';
import { Organization } from '../../../Models/organization';
import { School } from '../../../Models/school';
import { UntypedFormBuilder, Validators, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { OrganizationsManagerService } from 'src/app/modules/_services/organizations-manager.service';
import { Router } from '@angular/router';
import { SchoolManagerService } from 'src/app/modules/_services/school-manager.service';
import { ImageManagerService } from 'src/app/modules/_services/image-manager.service';

@Component({
  selector: 'app-new-organization',
  templateUrl: './new-organization.component.html',
  styleUrls: ['./new-organization.component.css'],
})
export class NewOrganizationComponent implements OnInit {
  newOrganizationCredentials = new Organization();
  organizationSchools: School[] = [];
  schoolCredentials: School = new School();
  index = 0;
  edit = false;
  editedOrganization: Organization;
  schoolLogos: any[] = [];
  orgId: string = '';

  schoolsForm: UntypedFormGroup;
  error: boolean;
  schoolsCreated = 0;

  constructor(
    private fb: UntypedFormBuilder,
    private organizationManagerService: OrganizationsManagerService,
    private schoolManagerService: SchoolManagerService,
    private router: Router,
    private imageService: ImageManagerService
  ) {
    this.schoolsForm = this.fb.group({
      schools: this.fb.array([]),
    });
  }

  ngOnInit(): void {}

  get schls(): UntypedFormArray {
    return this.schoolsForm.get('schools') as UntypedFormArray;
  }

  createNewOrganization() {
    if (this.edit) {
      this.editOrganization();
    } else {
      const name = document.getElementById('name') as HTMLInputElement;
      const url = document.getElementById('url') as HTMLInputElement;
      const code = document.getElementById('code') as HTMLInputElement;
      const licenseType = document.getElementById(
        'licenseType'
      ) as HTMLInputElement;
      const licenseDuration = document.getElementById(
        'licenseDuration'
      ) as HTMLInputElement;

      if (
        name.value.length != 0 &&
        url.value.length != 0 &&
        code.value.length != 0 &&
        licenseType.value.length != 0 &&
        licenseDuration.value.length != 0
      ) {
        if (this.schls.length == 0) {
          this.schls.push(this.newSchool());
        }
      } else {
        this.showModal();
      }
    }
  }
  // test() {
  //   this.jeff.nativeElement.scrollIntoView({
  //     behavior: 'smooth',
  //     block: 'nearest',
  //   });
  // }

  removeSchool(index) {
    console.log(index);
    this.schls.removeAt(index);

    console.log('index: ' + this.schls.controls.length);
    console.log('index1: ' + index);

    if (this.schls.controls.length > 0) {
      if (this.schls.controls.length == index) {
        let appearIndex = this.schls.controls.length - 1;

        const finishButton = document.getElementById(
          'finishButton' + appearIndex
        );
        const newSchool = document.getElementById('newSchool' + appearIndex);

        finishButton.style.display = 'block';
        newSchool.style.display = 'block';
      } else {
        let appearIndex = this.schls.controls.length;

        const finishButton = document.getElementById(
          'finishButton' + appearIndex
        );
        const newSchool = document.getElementById('newSchool' + appearIndex);

        finishButton.style.display = 'block';
        newSchool.style.display = 'block';
      }
    }
  }

  addSchool() {
    if (this.schls.length > 0) {
      const index = this.schls.length - 1;

      const finishButton = document.getElementById('finishButton' + index);
      const newSchool = document.getElementById('newSchool' + index);

      finishButton.style.display = 'none';
      newSchool.style.display = 'none';

      this.schls.push(this.newSchool());
    }
  }

  newSchool(): UntypedFormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      nameInArabic: ['', Validators.required],
      code: ['', Validators.required],
      schoolUrl: ['', Validators.required],
      email: ['', Validators.required],
      website: '',
      phone1: '',
      phone2: '',
      mobile: '',
      address: ['', Validators.required],
      licenseType: ['', Validators.required],
      licenseDuration: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      logo: [null, Validators.required],
      imageUploaded: [null, Validators.required],
    });
  }

  //  }

  onSubmit() {
    this.organizationManagerService
      .createOrganizationDittofi(this.newOrganizationCredentials)
      .then((data: any) => {
        console.log(data)
        this.orgId = data.data.Id;
        console.log(data.imageUpdateLink);

        if (data.imageUpdateLink != null) {
          this.imageService
            .uploadImageOrg(
              this.newOrganizationCredentials.image_uploaded,
              data.imageUpdateLink
            )
            .then((res) => {
              console.log(res);
              console.log('image uploaded successfully');
            })
            .catch((res) => {
              console.log(res);
            });
        }
        console.log('organization creaded with id: ' + this.orgId);
        this.createOrganizationSchools(this.orgId);
      })
      .catch((res) => {
        const text = document.getElementById('popupText');

        console.log(res);

        if (res.error.message === 'request validation error') {
          text.innerHTML = res.error.error.message;
        } else {
          text.innerHTML = res.error.message;
        }

        this.showModal();
      });
  }

  //   this.newOrganizationCredentials.schools = this.organizationSchools;

  //   const token = localStorage.getItem('loginToken').replace(/"/g, '');
  //   const newToken = 'Bearer ' + token;

  //   this.organizationManagerService
  //     .createOrganization(newToken, this.newOrganizationCredentials)
  //     .subscribe(
  //       (res) => {
  //         console.log(res['message']);
  //         const text = document.getElementById('popupText');

  //         this.error = true;
  //         text.innerHTML = 'Organization Created Successfully';
  //         this.showModal();
  //       },
  //       (error) => {
  //         const text = document.getElementById('popupText');
  //         text.innerHTML = 'Organization Created Successfully';
  //         this.showModal();

  //         console.log('hello hello' + error.message);
  //       }
  //     );
  // }

  onSelectFile(e) {
    this.newOrganizationCredentials.image_uploaded = e;
    this.newOrganizationCredentials.logo = e.target.files[0].name;
  }

  onSelectFileImage(e) {
    this.schoolLogos.push(e);
    const lastIndex = this.schls.controls.length - 1;
    this.schls.controls[lastIndex].get('logo').setValue(e.target.files[0].name);
  }

  counter(i: number) {
    return new Array(i);
  }

  showModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('is-active');
  }

  okayPressed() {
    if (this.error) {
      const model = document.getElementById('modal');
      model.classList.remove('is-active');
      this.router.navigateByUrl('/dashboard');
    } else {
      const model = document.getElementById('modal');
      model.classList.remove('is-active');
    }
  }

  editOrganization() {}

  createOrganizationSchools(orgId: string) {
    for (let i = 0; i < this.schls.controls.length; i++) {
      console.log(orgId);
      console.log(this.schls.controls[i].get('phone1').value);
      console.log('----------------------------------------------');

      this.organizationSchools.push({
        id: 0,
        organization_id: orgId,
        english_name: this.schls.controls[i].get('name').value,
        arabic_name: this.schls.controls[i].get('nameInArabic').value,
        code: this.schls.controls[i].get('code').value,
        school_url: this.schls.controls[i].get('schoolUrl').value,
        address: this.schls.controls[i].get('address').value,
        logo: this.schoolLogos[i].target.files[0].name,
        mobile: this.schls.controls[i].get('mobile').value,
        phone1: this.schls.controls[i].get('phone1').value,
        phone2: this.schls.controls[i].get('phone2').value,
        email: this.schls.controls[i].get('email').value,
        website: this.schls.controls[i].get('website').value,
        license_number: this.schls.controls[i].get('licenseNumber').value,
        license_type: this.schls.controls[i].get('licenseType').value,
        license_expiration_date:this.schls.controls[i].get('licenseDuration').value,
        is_active: true,
        created_at: '',
        updated_at: '',
        image_uploaded: this.schoolLogos[i],
        active_plugins: null,
      });
    }

    this.newOrganizationCredentials.schools = this.organizationSchools;

    for (let school of this.newOrganizationCredentials.schools) {
      this.schoolManagerService
        .createSchoolDittofi(school)
        .then((data: any) => {
          console.log('schools schools');
          console.log('school: ' + this.schoolsCreated);
          console.log(
            'school: ' + this.newOrganizationCredentials.schools.length
          );
          console.log(data);

          if (data.imageUpdateLink != null) {
            const imageurl = data.imageUpdateLink;
            this.imageService
              .uploadImageOrg(this.schoolLogos[this.schoolsCreated], imageurl)
              .then((res) => {
                console.log(res);
                this.schoolsCreated++;

                console.log(
                  'school image uploaded successfully: ' + this.schoolsCreated
                );
                console.log(
                  'school image uploaded successfully: ' +
                    this.newOrganizationCredentials.schools.length
                );

                if (
                  this.schoolsCreated ==
                  this.newOrganizationCredentials.schools.length
                ) {
                  const text = document.getElementById('popupText');

                  text.innerHTML =
                    'Organization and schools were added successfully';
                  this.error = true;
                  this.showModal();
                }
              })
              .catch((res) => {
                console.log(res);
              });
          }
            this.router.navigate(['../'])
        })
        .catch((res) => {
          console.log(res);

          this.schoolsCreated = 0;
          this.organizationSchools = [];
          this.organizationManagerService
            .deleteOrganizationDittofi(orgId)
            .then((res) => {
              console.log(res);
            })
            .catch((res) => {
              console.log(res);
            });

          const text = document.getElementById('popupText');
          // const title = document.getElementById('popupTitle');

          // title.innerHTML = school.englishName;
          const err = res.error.message;

          if (err === 'request validation error') {
            text.innerHTML = res.error.error.message;
          } else {
            text.innerHTML = res.error.message;
          }

          this.showModal();
        });
    }
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
