import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-personal-details',
  templateUrl: './employee-personal-details.component.html',
  styleUrls: ['./employee-personal-details.component.css'],
})
export class EmployeePersonalDetailsComponent implements OnInit {
  @Input() EmployeeMetaData;

  constructor() {}

  ngOnInit(): void {
    console.log(this.EmployeeMetaData)
  }
}
