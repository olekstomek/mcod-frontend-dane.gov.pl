import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BreadcrumbsDatasetResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-dataset.resolver';
import { DatasetParentComponent } from '@app/pages/dataset/dataset-parent/dataset-parent.component';
import { BreadcrumbsResourceResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-resource.resolver';

import { DatasetComponent } from './dataset-page/dataset.component';
import { DatasetItemComponent } from './dataset-item/dataset-item.component';
import { DatasetResourceComponent } from './dataset-resource/dataset-resource.component';
import { SuggestDatasetComponent } from './suggest-dataset/suggest-dataset.component';

const routes: Routes = [
    { path: '', component: DatasetComponent },
    { path: 'submissions', component: SuggestDatasetComponent },
    {
        path: ':id', 
        component: DatasetParentComponent, 
        data: {
            breadcrumbs: '{{ post.data.attributes.title }}'
        },
        resolve: {
            post: BreadcrumbsDatasetResolver
        },
        children: [
            {
                path: '',
                component: DatasetItemComponent
            },
            {
                path: 'resource/:resourceId',
                component: DatasetResourceComponent,
                data: {
                    breadcrumbs: '{{ post.attributes.title }}'
                },
                resolve: {
                    post: BreadcrumbsResourceResolver
                }
            }
        ]
    },
];

/**
 * @ignore
 */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DatasetRoutingModule {}
