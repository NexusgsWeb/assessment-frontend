import { Injectable, EventEmitter } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Event, NavigationEnd } from '@angular/router';
import { Breadcrumb } from 'angular-crumbs';

@Injectable({
    providedIn: 'root'
  })

export class BreadcrumbService {
    breadcrumbChanged = new EventEmitter<Breadcrumb[]>(false);

    private breadcrumbs = new Array<Breadcrumb>();

    constructor(private router: Router) {
        this.router.events.subscribe((routeEvent) => { this.onRouteEvent(routeEvent); });
    }

    public changeBreadcrumb(route: ActivatedRouteSnapshot, name: string) {
        const rootUrl = this.createRootUrl(route);
        const breadcrumb = this.breadcrumbs.find(function (bc) { return bc.url === rootUrl; });

        if (!breadcrumb) { return; }

        console.log('----------------' + breadcrumb.displayName)
        console.log('----------------' + name)

        breadcrumb.displayName = name;

        this.breadcrumbChanged.emit(this.breadcrumbs);
    }

    private onRouteEvent(routeEvent: Event) {
        if (!(routeEvent instanceof NavigationEnd)) { return; }

        let route = this.router.routerState.root.snapshot;
        let url = '';

        var breadCrumbIndex = 0;
        var newCrumbs = [];

        while (route.firstChild != null) {
            route = route.firstChild;

            if (route.routeConfig === null) { continue; }
            if (!route.routeConfig.path) { continue; }

            url += `/${this.createUrl(route)}`;

            if (!route.data['breadcrumb']) { continue; }

            var newCrumb = this.createBreadcrumb(route, url)

            if (breadCrumbIndex < this.breadcrumbs.length) {
              var existing = this.breadcrumbs[breadCrumbIndex++];

              if (existing && existing.route == route.routeConfig) {
                newCrumb.displayName = existing.displayName;
              }
            }

            newCrumbs.push(newCrumb);
        }

        this.breadcrumbs = newCrumbs;
        console.log('++++++++++++++++' + this.breadcrumbs[0])
        this.breadcrumbChanged.emit(this.breadcrumbs);
    }

    private createBreadcrumb(route: ActivatedRouteSnapshot, url: string): Breadcrumb {
        // Generates display text from data
        // -- Dynamic route params when ':[id]'
        let d = '';
        const split = route.data['breadcrumb'].split(' ');
        split.forEach((s: string) => {
            d += `${s.indexOf(':') > -1 ? (route.params[s.slice(1)] ? route.params[s.slice(1)] : '') : s} `;
        });
        d = d.slice(0, -1);

        return {
            displayName: d,
            terminal: this.isTerminal(route),
            url: url,
            route: route.routeConfig
        };
    }

    private isTerminal(route: ActivatedRouteSnapshot) {
        return route.firstChild === null
            || route.firstChild.routeConfig === null
            || !route.firstChild.routeConfig.path;
    }

    private createUrl(route: ActivatedRouteSnapshot) {
        return route.url.map(function (s) { return s.toString(); }).join('/');
    }

    private createRootUrl(route: ActivatedRouteSnapshot) {
        let url = '';
        let next = route.root;

        while (next.firstChild !== null) {
            next = next.firstChild;

            if (next.routeConfig === null) { continue; }
            if (!next.routeConfig.path) { continue; }

            url += `/${this.createUrl(next)}`;

            if (next === route) { break; }
        }

        return url;
    }
}