import { Component, Input, OnInit } from '@angular/core';
import { WizenoseManagerService } from 'src/app/modules/_services/wizenose-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loitem-imp',
  templateUrl: './loitem-imp.component.html',
  styleUrls: ['./loitem-imp.component.css'],
})
export class LOItemIMPComponent implements OnInit {
  @Input() LOItem;
  loContent: any[] = []

  constructor(private wizeNoseManager: WizenoseManagerService, private router: Router) {}

  ngOnInit(): void {

   
   

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

}
