import { Component, OnInit } from '@angular/core';
import { slider } from 'src/app/modules/animations/animations';
import { School } from 'src/app/modules/Models/school';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css'],
  animations: [slider],
})
export class AssessmentComponent implements OnInit {

  schoolId: string;
  modules: any = [];
  schools: School[] = [];
  sideBarOpen = true;


  //delete pop over
  popoverTitle = 'popoverTitle';
  popoverMessage = 'popoverMessage';
  clickConfirmed: boolean = false;
  cancelClicked: boolean = false;
  name: string = '';
  nameSybmol: string = '';



  constructor(
    private auth: AuthManagerService,
  ) {}

  ngOnInit(): void {
    this.name = this.auth.getUserName();

    const comp = this.name.split(' ', 2);
    this.nameSybmol = comp[0].charAt(0) + comp[1].charAt(0);
  }

  toggleSidebar() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  didPressSearchButton() {
    console.log('didPressSearchButton');
  }
  logout() {
    this.auth.logout();
  }
  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }



}
