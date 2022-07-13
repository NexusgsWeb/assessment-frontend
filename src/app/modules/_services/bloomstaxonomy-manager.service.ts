import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getBloomsTaxonomyURL, getBloomsTaxonomyDittofi } from 'src/app/shared/static_data/apiURL';
import { AuthManagerService } from './auth-manager.service';

@Injectable({
  providedIn: 'root',
})
export class BloomstaxonomyManagerService {
  constructor(
    private authService: AuthManagerService,
    private http: HttpClient
  ) {}

  getBloomsTaxonomyDittofi() {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());
    return new Promise((resolve, reject) => {
      this.http
        .get(getBloomsTaxonomyDittofi, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

}
