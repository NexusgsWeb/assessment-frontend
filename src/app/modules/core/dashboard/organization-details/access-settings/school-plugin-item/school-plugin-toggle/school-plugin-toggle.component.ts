import { Component, Input, OnInit } from '@angular/core';
import { SchoolPlugin } from 'src/app/modules/Models/SchoolPlugin';
import { Router } from '@angular/router';
import { PluginManagerService } from 'src/app/modules/_services/plugin-manager.service';

@Component({
  selector: 'app-school-plugin-toggle',
  templateUrl: './school-plugin-toggle.component.html',
  styleUrls: ['./school-plugin-toggle.component.css'],
})
export class SchoolPluginToggleComponent implements OnInit {
  @Input() currentPlugin: any;
  constructor(private pluginManager: PluginManagerService) {}

  ngOnInit(): void {
    console.log('customized Plugins')
    console.log(this.currentPlugin)
  }

  activatePlugin(){
    console.log('school id: ' + this.currentPlugin.schoolId)
    console.log('school id: ' + this.currentPlugin.id)

    this.pluginManager.activatePlugins(this.currentPlugin.schoolId, this.currentPlugin.id).then((res) => {
      console.log(res);
    }).catch((res) => {
      console.log(res);
    })
  }

  deactivatePlugin(){
    this.pluginManager.deactivatePlugins(this.currentPlugin.schoolId, this.currentPlugin.id).then((res) => {
      console.log(res);
    }).catch((res) => {
      console.log(res);
    })
  }

  actDeactPlugin(checked: boolean){
    if(checked){
      this.activatePlugin();
    }
    else{
      this.deactivatePlugin();
    }
  }
}
