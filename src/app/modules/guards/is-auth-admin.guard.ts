import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { AuthManagerService } from '../_services/auth-manager.service';

@Injectable({
  providedIn: 'root',
})
export class IsAuthAdminGuard implements CanActivate {
  constructor(
    private AuthService: AuthManagerService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}

  async canActivate() {
    //if user is authenticated then redirect him to /dashboard
    if (await this.AuthService.CheckIfAuthenticatedAdmin()) {
      this.router.navigate(['/dashboard'], {
        relativeTo: this.activeRoute.parent,
      });
    }
    return true;
  }
}
