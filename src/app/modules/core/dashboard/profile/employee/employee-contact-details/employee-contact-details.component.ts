import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-contact-details',
  templateUrl: './employee-contact-details.component.html',
  styleUrls: ['./employee-contact-details.component.css'],
})
export class EmployeeContactDetailsComponent implements OnInit {
  @Input() EmployeeMetaData;

  constructor() {}

  ngOnInit(): void {}
}
