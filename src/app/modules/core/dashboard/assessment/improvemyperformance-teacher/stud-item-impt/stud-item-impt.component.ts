import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stud-item-impt',
  templateUrl: './stud-item-impt.component.html',
  styleUrls: ['./stud-item-impt.component.css'],
})
export class StudItemIMPTComponent implements OnInit {
  @Input() studentLOInfo;
  constructor() {}

  ngOnInit(): void {
    console.log('hey hey')
    console.log(this.studentLOInfo)
  }

  studentEvaluation(percentage){
    if(percentage >= 80){
      return 1
    }
    else if(percentage < 80 && percentage >= 50){
      return 2
    }
    else{
      return 3
    }

  }
}
