import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthManagerService } from '../_services/auth-manager.service';

@Injectable({
  providedIn: 'root',
})
export class IsAuthGuard implements CanActivate {
  constructor(
    private AuthService: AuthManagerService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log(route)
    console.log(state)

    console.log(state.url);
    console.log(this.checkLogin(state.url))
        let url: string = state.url;
        return this.checkLogin(url);

    // if (await this.AuthService.CheckIfAuthenticatedAdmin()) {
    //   console.log('You are authenticated :) logged in automatically');
    //   let url = state.url;
    //   this.AuthService.redirectUrl = url;
    //   console.log(url);
    //   return true;
    // } else {
    //   console.log(await this.AuthService.CheckIfAuthenticatedAdmin());
    //   console.log('You dont seem to be authenticated.. redirecting to auth..');
    //   this.router.navigate(['/auth'], {
    //     relativeTo: this.activeRoute.parent,
    //   });
    // }
  }

  checkLogin(url: string): boolean {
    console.log("called")
    if(this.AuthService.CheckIfAuthenticatedAdmin()) { 
      return true; 
    }
    this.AuthService.redirectUrl = url; // set url in authService here
    console.log('called9')

    this.router.navigate([ '/auth' ]); // then ask user to login
    
    // , { queryParams: { type: 'School', tenant: 'iquad'} }
    return false;
  }

}
