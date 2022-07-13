import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../Models/User';
import {
  SocialAuthService,
  GoogleLoginProvider,
  MicrosoftLoginProvider,
} from 'angularx-social-login';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { slider } from '../../animations/animations';
import { AuthManagerService } from '../../_services/auth-manager.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  animations: [slider],
})
export class AuthComponent implements OnInit {
  defaultWallpaper = 'assets/images/massarat_login.png';
  logo = 'assets/images/massarat_logo.png';
  microsoftImage = 'assets/images/microsoft.png';
  googleImage = 'assets/images/google.png';

  loginCredentials: any = {};
  schoolLogo: any = '';
  schoolProfileImage: any = '';
  user: User;

  test = false;

  errorMsg = '';

  constructor(
    private authService: AuthManagerService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log(this.activeRoute.snapshot.queryParams['type']);
    this.authService.user_Type = 'user';
  }
  forgetPass(): void {
    this.router.navigateByUrl('forgetPass');
  }
  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }
}
