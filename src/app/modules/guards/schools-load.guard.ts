import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { SchoolManagerService } from '../_services/school-manager.service';

@Injectable({
  providedIn: 'root',
})
export class SchoolsLoadGuard implements Resolve<any> {
  constructor(private schoolService: SchoolManagerService) {}
  async resolve(route: ActivatedRouteSnapshot) {
    console.log(route.params['org_id']);
    return await this.schoolService.getSchoolByID(route.params['org_id']);
  }
}
