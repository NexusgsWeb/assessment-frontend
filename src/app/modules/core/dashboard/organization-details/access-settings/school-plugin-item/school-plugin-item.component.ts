import { Component, Input, OnInit } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { School } from 'src/app/modules/Models/school';
import { PluginManagerService } from 'src/app/modules/_services/plugin-manager.service';
import { SchoolPlugin } from 'src/app/modules/Models/SchoolPlugin';

@Component({
  selector: 'app-school-plugin-item',
  templateUrl: './school-plugin-item.component.html',
  styleUrls: ['./school-plugin-item.component.css'],
})
export class SchoolPluginItemComponent implements OnInit {
  @Input() school: School;
  @Input() PluginList;

  ActivatedPlugins: SchoolPlugin[] = [];

  PluginModel = [];

  constructor() {}

  ngOnInit(): void {
    //ESSENTIAL
    this.ActivatedPlugins = this.school.active_plugins;

    console.log(this.ActivatedPlugins)
    console.log('-----------------------------------------')

    for(let i = 0; i< this.PluginList.length; i++){
      const found = this.ActivatedPlugins.some(j => {
        if (j.id === this.PluginList[i].id) {
          return true;
      }
      return false;
      })

      if(found){
        this.PluginModel.push({id: this.PluginList[i].id, name: this.PluginList[i].name, status: true, schoolId: this.school.id})
      }
      else{
        this.PluginModel.push({id: this.PluginList[i].id, name: this.PluginList[i].name, status: false, schoolId: this.school.id})
      }
    }
        console.log(this.PluginModel);
  }

  
}
