import { Component, OnInit } from '@angular/core';
import { WizenoseManagerService } from 'src/app/modules/_services/wizenose-manager.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  title = 'Card View Demo';

  gridColumns = 3;

  data: any[]
  constructor(private wizeNoseManager:WizenoseManagerService) { }

  ngOnInit(): void {
    this.data = this.wizeNoseManager.content.getValue();
  }

  goToLink(content){
    window.open(content.clickUrl, "_blank");
  }

  toggleGridColumns() {
    this.gridColumns = this.gridColumns === 3 ? 4 : 3;
  }

}
