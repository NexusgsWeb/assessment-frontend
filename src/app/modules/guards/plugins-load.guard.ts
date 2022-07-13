import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PluginManagerService } from '../_services/plugin-manager.service';

@Injectable({
  providedIn: 'root',
})
export class PluginsLoadGuard implements Resolve<any> {
  constructor(private pluginService: PluginManagerService) {}
  async resolve() {
    let value: any = await this.pluginService.getAllPluginsDittofi();
    return value.plugins;
  }
}
