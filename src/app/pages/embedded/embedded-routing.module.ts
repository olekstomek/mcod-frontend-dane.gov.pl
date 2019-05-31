import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { EmbeddedComponent } from '@app/pages/embedded/embedded.component';

const routes: Routes = [
    {path: '', component: EmbeddedComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmbeddedRoutingModule { }
