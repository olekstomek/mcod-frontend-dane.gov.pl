import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';

import { HomeComponent } from './home.component';
import { ServicesModule } from '@app/services/services.module';
import { SearchComponent } from './search/search.component';
import { CategoriesComponent } from './categories/categories.component';
import { StatsComponent } from './stats/stats.component';
import { InstitutionsComponent } from './institutions/institutions.component';
import { NewsComponent } from './news/news.component';
import { SharedModule } from '@app/shared/shared.module';
import { CookieService } from 'ngx-cookie-service';
import { ServiceAlertComponent } from './service-alert/service-alert.component';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                HttpClientTestingModule,
                SharedModule,
                FormsModule,
                ServicesModule,
                TranslateModule.forRoot({}),
                NgxLocalStorageModule.forRoot({prefix: 'mcod'})
            ],
            declarations: [
                HomeComponent,
                SearchComponent,
                CategoriesComponent,
                StatsComponent,
                InstitutionsComponent,
                NewsComponent,
                ServiceAlertComponent
            ],
            providers: [
                CookieService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
