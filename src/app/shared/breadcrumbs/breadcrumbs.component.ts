import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { filter, map, distinctUntilChanged } from 'rxjs/operators';

import { TemplateHelper } from '@app/shared/helpers';

/**
 * Breadcrumbs global component
 */
@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html'
})
export class BreadcrumbsComponent {

    /**
     * Determines breadcrumbs visibility based on specific page. By default breadcrumbs are hidden on home page.
     */
    public displayBreadcrumbs: boolean;

    /**
     * Name of component that is displayed
     */
    private componentName: string;

    /**
     * Breadcrumbs observable monitor changes to breadcrumbs tree
     */
    private breadcrumbs$: Observable<any>;

    /**
     * Subscribes to router changes and updates breadcrumbs every time url changes
     * @param {ActivatedRoute} activatedRoute
     * @param {Router} router
     * @param {TranslateService} translate
     */
    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private translate: TranslateService) {

        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                distinctUntilChanged(),
                map(() => this.buildBreadcrumb(this.activatedRoute.root))
            )
            .subscribe(res => {
                this.breadcrumbs$ = res;
                this.displayBreadcrumbs = !this.router.isActive('/', true);
            });
    }

    /**
     * Builds breadcrumbs path elements - recursive function.
     * @param {ActivatedRoute} route
     * @param {string} [url]
     * @param {Array<any>} [breadcrumbs]
     * @returns {any}
     */
    private buildBreadcrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Array<any> = []) {

        this.componentName = route.routeConfig && route.routeConfig.component ? route.routeConfig.component.name : 'Root';
        if (route.routeConfig && !route.routeConfig.component) {
            this.componentName = route.snapshot.routeConfig.path.charAt(0).toUpperCase() + route.snapshot.routeConfig.path.slice(1) + 'Module';
        }
        // const label = route.routeConfig && route.routeConfig.component ? route.routeConfig.component.name : 'Breadcrumbs.';
        const path = route.routeConfig && route.routeConfig.path ? route.routeConfig.path : '';
        const params = url !== '' && route.snapshot && route.snapshot.params ? route.snapshot.params : null;

        let title = route.routeConfig && route.routeConfig.data && route.routeConfig.data['breadcrumbs'] ? route.routeConfig.data['breadcrumb'] : '';

        if (route.routeConfig && route.routeConfig.data && route.routeConfig.data['breadcrumbs']) {
            const data = route.routeConfig.data;

            const text = data.breadcrumbs && typeof (data.breadcrumbs) === 'string' ? data.breadcrumbs : data.breadcrumbs.text || data.text || path;
            title = TemplateHelper.compileTemplate(text, route.snapshot.data);
        }
        // #1 Parse current URL
        let nextUrl = `${url}${path}/`;

        nextUrl = TemplateHelper.parseUrl(nextUrl, params as any[]);

        // Prepare clean array of segments for [routerLink]
        let segments = nextUrl.split('/');
        segments.unshift('/'); // Start from root
        segments = segments.filter(n => !!n); // Filter out empty strings, nulls and undefined

        const breadcrumb = {
            label: title,
            url: nextUrl,
            lastChild: true,
            segments: segments,
            params: params
        };

        // Create translation support
        const key = 'Breadcrumbs.' + this.componentName;
        this.translate.stream(key).subscribe(res => {
            if (res !== key) {
                breadcrumb.label = res + title;
            }
        });

        const newBreadcrumbs = breadcrumb ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
        if (route.firstChild) {
            breadcrumb.lastChild = false;
            return this.buildBreadcrumb(route.firstChild, nextUrl, newBreadcrumbs);
        } else if (!!newBreadcrumbs[newBreadcrumbs.length - 1]) {
            newBreadcrumbs[newBreadcrumbs.length - 1].lastChild = true;
        }

        return newBreadcrumbs;
    }

}
