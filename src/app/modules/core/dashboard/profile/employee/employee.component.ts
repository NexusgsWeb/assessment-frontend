import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/modules/Models/Employee';
import { Student } from 'src/app/modules/Models/Student';
import { ImgURL } from 'src/app/shared/static_data/apiURL';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  SelectedEmployee: Employee;
  EmployeeMetaData: any;
  S3Link;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log('Loading employees...');
    this.SelectedEmployee =
      this.route.snapshot.data['EmployeeData'].data;
    this.EmployeeMetaData = this.route.snapshot.data['EmployeeData'].data;
    // this.S3Link = ImgURL + this.EmployeeMetaData.user.profilePictureUrl;
    // console.log(this.S3Link);
    // console.log(this.StudentMetaData.user.logoName);
    // console.log(this.StudentMetaData);
  }

  getDepartmentNames(employee: any){
    var depNames = ''
    if(employee.departments.length == 0){
      return '-';
    }
    else if(employee.departments.length == 1){
      return employee.departments[0].name;
    }
    else{
      depNames = employee.departments[0].name
      for(let i =1; i< employee.departments.length; i++){
        depNames = depNames + ', ' + employee.departments[i].name;
      }
      return depNames;
    }
  }
}
