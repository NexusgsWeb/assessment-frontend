import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WizenoseManagerService } from 'src/app/modules/_services/wizenose-manager.service';

@Component({
  selector: 'app-loitem-impt',
  templateUrl: './loitem-impt.component.html',
  styleUrls: ['./loitem-impt.component.css'],
})
export class LOItemIMPTComponent implements OnInit {
  @Input() LOItem;
  loContent: any[] = [];
  constructor(private router: Router, private wizeNoseManager: WizenoseManagerService) {}

  ngOnInit(): void {
   
  }



  viewContent(loItem){
    console.log(loItem)
    console.log(loItem.id)

    const lo = [loItem.id]
    this.wizeNoseManager.getLOPerformance(lo).then((res : any) => {
      this.loContent = res.suggestions[0].data;
      console.log(this.loContent)

      this.wizeNoseManager.content.next(this.loContent);
    this.router.navigateByUrl('/assessment/content')
    }).catch((res) => {
      console.log(res)
    })
  }


  loEvaluation(value){
    if(value >= 80){
      return 1
    }
    else if(value < 80 && value >= 50){
      return 2
    }
    else{
      return 3
    }
  }
}
