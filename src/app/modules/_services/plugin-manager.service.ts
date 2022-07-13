import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  getAllPluginsURL,
  ActivatePluginURL,
  DeactivatePluginURL,
  getAllPluginsDittofi,
} from 'src/app/shared/static_data/apiURL';
import { AuthManagerService } from './auth-manager.service';

@Injectable({
  providedIn: 'root',
})
export class PluginManagerService {
  constructor(
    private http: HttpClient,
    private authService: AuthManagerService
  ) {}




  getAllPluginsDittofi() {
    const headers = new HttpHeaders().set('content-type', 'application/json')
    .set('Authorization', this.authService.getToken());

    return new Promise((resolve, reject) => {
      this.http
        .get(getAllPluginsDittofi, { headers: headers })
        .toPromise()
        .then((res) => resolve(res))
        .catch((res) => reject(res));
    });
  }


  activatePlugins(schoolId: string, pluginId: string) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());

    return new Promise((resolve, reject) => {
      this.http
        .patch(ActivatePluginURL(pluginId, schoolId), null, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  deactivatePlugins(schoolId: string, pluginId: string) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.authService.getToken());

    return new Promise((resolve, reject) => {
      this.http
        .patch(DeactivatePluginURL(pluginId, schoolId), null, {
          headers: headers,
        })
        .toPromise()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
}
