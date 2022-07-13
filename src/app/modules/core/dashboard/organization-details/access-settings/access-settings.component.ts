import { Component, Input, OnInit } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Organization } from 'src/app/modules/Models/organization';
import { PluginManagerService } from 'src/app/modules/_services/plugin-manager.service';

@Component({
  selector: 'app-access-settings',
  templateUrl: './access-settings.component.html',
  styleUrls: ['./access-settings.component.css'],
})
export class AccessSettingsComponent implements OnInit {
  @Input() SelectedOrganization;
  @Input() PluginList;

  constructor() {}

  ngOnInit() {}
  handleLoadMobilePlugins() {}
  handleLoadWebPlugins() {}
}
