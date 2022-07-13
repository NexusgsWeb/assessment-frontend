import { Component, Input, OnInit } from '@angular/core';
import { RemarksmanagerService } from 'src/app/modules/_services/remarksmanager.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-saconfigurequestion-remarkitem',
  templateUrl: './saconfigurequestion-remarkitem.component.html',
  styleUrls: ['./saconfigurequestion-remarkitem.component.css'],
})
export class SAconfigurequestionREMARKITEMComponent implements OnInit {
  @Input() RemarkReferenceArray;
  @Input() RemarkData;
  @Input() QuestionData;
  constructor(private remarkManager: RemarksmanagerService, public datePipe: DatePipe) {}

  ngOnInit(): void {

    console.log(this.RemarkData)
    console.log(this.RemarkData.created_at)

    const dateStartDate = new Date(this.RemarkData.created_at)

    const from = this.datePipe.transform(
      dateStartDate,
      'dd-MM-yyyy HH:mm a'
    );


    this.RemarkData.created_at = from;

  }
}
