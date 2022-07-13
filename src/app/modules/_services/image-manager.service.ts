import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImgURL, uploadOrganizationLogo } from 'src/app/shared/static_data/apiURL';

@Injectable({
  providedIn: 'root',
})
export class ImageManagerService {
  constructor(private http: HttpClient) {}

  async uploadImageOrg(element: any, url: string) {
    var file = element.target.files[0];
    return new Promise((resolve, reject) => {
      this.http
        .put(url, file, {})
        .toPromise()
        .then((res) => {
          console.log('Success, Link : ' + url.split(/[?#]/)[0]);
          resolve(res);
        })
        .catch((res) => {
          reject(res);
        });
    });
  }

  async uploadImageOrgDittofi(element: any, organization_id: number) {
    var file = element.target.files[0];
    return new Promise((resolve, reject) => {
      this.http
        .put(uploadOrganizationLogo(organization_id), file, {})
        .toPromise()
        .then((res) => {
          console.log('Success, Link : ' + res);
          resolve(res);
        })
        .catch((res) => {
          reject(res);
        });
    });
  }


  async uploadImageStudent(url, element) {
    var file = element.target.files[0];
    return new Promise((resolve, reject) => {
      this.http
        .put(url, file, {})
        .toPromise()
        .then((res) => {
          console.log('Success, Link : ' + url.split(/[?#]/)[0]);
          resolve(res);
        });
    });
  }

  async uploadImageParent(url, element) {
    var file = element.target.files[0];
    return new Promise((resolve, reject) => {
      this.http
        .put(url, file, {})
        .toPromise()
        .then((res) => {
          console.log('Success, Link : ' + url.split(/[?#]/)[0]);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
