import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { EmployeeManagerService } from '../_services/employee-manager.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeLoadGuard implements Resolve<any> {
  constructor(private employeeManager: EmployeeManagerService) {}
  async resolve(route: ActivatedRouteSnapshot) {
    return await this.employeeManager.getEmployeeByIDDittofi(
      route.params['EmployeeID']
    );
  }
}
