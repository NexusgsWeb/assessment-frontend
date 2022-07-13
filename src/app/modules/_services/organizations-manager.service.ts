import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { resolve } from 'dns';
import {
  createOrganizationUser,
  deactivateActivateOrganization,
  deactivateActivateSchool,
  deleteOrganizationsURL,
  deleteOrganizationUsersBulkURL,
  editOrganizationURL,
  getOneOrganizationURL,
  getOrganizationsURL,
  getOrganizationUsersURL,
  get_all_organizations_dittofi,
  delete_organizations_dittofi,
  show_organizations_dittofi,
  edit_organizations_dittofi,
  create_organization_dittofi,
  deactivateActivateOrganizationDittofi,
  getOrganizationUsersDittofi,
} from 'src/app/shared/static_data/apiURL';
import { Organization } from '../Models/organization';
import { AuthManagerService } from './auth-manager.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsManagerService {

  selectedOrganization$ = new BehaviorSubject<Organization>(null);

  constructor(
    private http: HttpClient,
    private authManager: AuthManagerService
  ) {}

  getAllOrganizationsDittofi() {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', this.authManager.getToken());
      this.http
        .get(get_all_organizations_dittofi, { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  deleteOrganizationDittofi(organization_id) {
    console.log('organization id: ' + organization_id);
    const headers = new HttpHeaders()
      .set('content-type', 'application/json');
    return new Promise((resolve, reject) => {
      this.http
        .post(delete_organizations_dittofi(organization_id), {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }




  getOrganizationByIDDittofi(organization_id) {

    console.log(this.authManager.getToken())
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authManager.getToken())
      ;
    return new Promise((resolve, reject) => {
      this.http
        .get(show_organizations_dittofi(organization_id), { headers: headers, withCredentials: true })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  editOrganizationDittofi(organization: Organization) {
    const org = {
      license_expiration_date: organization.license_expiration_date,
      code: organization.code,
      organization_url: organization.organization_url,
      mobile: organization.mobile,
      phone1: organization.phone1,
      phone2: organization.phone2,
      email: organization.email,
      website: organization.website,
      license_number: organization.license_number,
      license_type: organization.license_type,
      role: organization.role,
      address: organization.address,
      arabic_name: organization.arabic_name,
      english_name: organization.english_name
    }

    console.log(org)
    console.log(edit_organizations_dittofi(organization.id))

    const headers = new HttpHeaders()
      .set('content-type', 'application/json');
      console.log(this.authManager.getToken());
    return new Promise((resolve, reject) => {
      this.http
        .put(edit_organizations_dittofi(organization.id), org, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }


  createOrganizationDittofi(organization: Organization) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')

      let d = new Date(organization.license_expiration_date)
      let led = d.toISOString();
      console.log(led)
      console.log(this.authManager.getUserId())
    const temp = {
      english_name: organization.english_name,
      arabic_name: organization.arabic_name,
      code: organization.code,
      organization_url: organization.organization_url,
      email: organization.email,
      website: organization.website,
      phone1: organization.phone1,
      phone2: organization.phone2,
      mobile: organization.mobile,
      address: organization.address,
      license_type: organization.license_type,
      license_expiration_date: led,
      license_number: Number(organization.license_number),
      logo: organization.logo,
      role: 'organization',
      created_by: this.authManager.getUserId()
    };
    console.log(temp)
    return new Promise((resolve, reject) => {
      this.http
        .post(create_organization_dittofi, temp, { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }


  deactivateOrganizationDittofi(organization_id, ToActivate) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json');


    return new Promise((resolve, reject) => {
      this.http
        .put(deactivateActivateOrganizationDittofi(organization_id, ToActivate), null, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  getAllOrganizationUsersDittofi(organization_id) {
    // const headers = new HttpHeaders().set(
    //   'Authorization',
    //   this.authManager.getToken()
    // );
    return new Promise((resolve, reject) => {
      this.http
        .get(getOrganizationUsersDittofi(organization_id))
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  createOrganizationUser(organization_id, user) {
    const headers = new HttpHeaders().set(
      'Authorization',
      this.authManager.getToken()
    );
    return new Promise((resolve, reject) => {
      this.http
        .post(createOrganizationUser(organization_id), user, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  deleteOrganizationUsersBulk(organization_id, users_to_be_deleted: any[]) {
    const options = {
      headers: new HttpHeaders({
        Authorization: this.authManager.getToken(),
      }),
      body: {
        usersIDs: users_to_be_deleted,
      },
    };
    return new Promise((resolve, reject) => {
      this.http
        .delete(deleteOrganizationUsersBulkURL(organization_id), options)
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
}
