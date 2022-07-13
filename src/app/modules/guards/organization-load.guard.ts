import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { OrganizationsManagerService } from '../_services/organizations-manager.service';

@Injectable({
  providedIn: 'root',
})
export class OrganizationLoadGuard implements Resolve<any> {
  constructor(private organizationService: OrganizationsManagerService) {}
  async resolve(route: ActivatedRouteSnapshot) {
    return await this.organizationService.getOrganizationByIDDittofi(
      route.params['id']
    );
  }
}
