import { Component, OnInit } from '@angular/core';
import { KatexModule } from 'ng-katex';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-schools-dashboard',
  templateUrl: './schools-dashboard.component.html',
  styleUrls: ['./schools-dashboard.component.css']
})
export class SchoolsDashboardComponent implements OnInit {
  equation: string = ''
  isStudent: boolean = false;
  isParent: boolean = false;
  isEmployee: boolean = false;
  isAdmin: boolean = false;
 

  constructor(private auth: AuthManagerService, private router: Router) { }

  ngOnInit(): void {
    this.router.navigateByUrl('super')

    var chosenType = this.auth.getTypeOfUser();
    console.log(chosenType)
    var types = ['teacher', 'parent', 'admin', 'student', 'super'];
    if(chosenType == 'student'){
      this.isStudent = true;
    }
    else if(chosenType == 'parent'){
      this.isParent = true;
    }
    else if(chosenType == 'employee'){
      this.isEmployee = true;
    }
    else if(chosenType == 'admin'){
      this.isAdmin = true;
    }
    else{
      this.isAdmin = true;
    }

    var chosenType = this.auth.getTypeOfUser();
 
    if(chosenType == 'super'){
      this.router.navigateByUrl('dashboard/super')

    }
    else{
      if(chosenType == 'student'){
        this.router.navigateByUrl('assessment/viewAssessments/student')
      }
      else{
        this.router.navigateByUrl('assessment/viewAssessments')
    
        // this.router.navigateByUrl('/')
    
      }
    }
  
    
  }

  typed(event){
    // \\sum_{i=1}^nx_i
    this.equation = event
    console.log(event)
  }
  didClickNavigate(PATH, param?) {
    this.router.navigateByUrl(PATH);
  }
}
