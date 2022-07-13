import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthManagerService } from './auth-manager.service';
import { getBooks, getBook, getUnits, filter, getAvayaAccessToken } from 'src/app/shared/static_data/apiURL';
import { ChapterSection } from '../Models/ChapterSection';


@Injectable({
  providedIn: 'root',
})
export class CalendarManagerService {
  constructor(
    private http: HttpClient,
    private authService: AuthManagerService
  ) {}

 getAvayaAccessToken(){
    return new Promise((resolve, reject) => {
        const headers = new HttpHeaders()
          .set('content-type', 'application/x-www-form-urlencoded')
  
        const formData = new FormData()
        formData.append('grant_type', 'password');
        formData.append('client_id', 'f20d43e70a989fcdecd9');
        formData.append('client_secret', '4f10db3819b0a8f855a6d28bb9931d68f71213ad');
        formData.append('scope', 'spaces profile email');
        formData.append('username', 'amjad.mahfoud@iquadme.com');
        formData.append('password', '29!Sw5t_MMem-v9');


        // const body = {
        //   grant_type: 'password',
        //   client_id: 'f20d43e70a989fcdecd9',
        //   client_secret: '4f10db3819b0a8f855a6d28bb9931d68f71213ad',
        //   scope: 'spaces profile email',
        //   username: 'amjad.mahfoud@iquadme.com',
        //   password: '29!Sw5t_MMem-v9',
        // };
        this.http
          .post(getAvayaAccessToken(), formData, {
            headers: headers
          })
          .toPromise()
          .then((res) => resolve(res))
          .catch((res) => reject(res));
      });
 }

  
}
