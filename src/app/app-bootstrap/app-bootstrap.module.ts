import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginationModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
	imports: [
		CommonModule,
		BsDropdownModule.forRoot(),
		TooltipModule.forRoot(),
		ModalModule.forRoot(),
		CollapseModule.forRoot(),
		PaginationModule.forRoot()
	],
	exports: [BsDropdownModule, TooltipModule, ModalModule, CollapseModule, PaginationModule]
})
export class AppBootstrapModule { }
