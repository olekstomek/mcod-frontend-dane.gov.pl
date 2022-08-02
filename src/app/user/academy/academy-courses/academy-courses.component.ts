import { Component, OnInit } from '@angular/core';

import { AodCourseType } from '@app/user/academy/academy-courses/AodCourseType';
import { UserDashboardListViewConfig } from '@app/user/list-view/UserDashboardListViewConfig';
import { API_URL } from '@app/user/list-view/API_URL';
import { ApiConfig } from '@app/services/api';
import { AcademyCoursesListContainerComponent } from '@app/user/academy/academy-courses/academy-courses-list/academy-courses-list-container.component';
import { SeoService } from '@app/services/seo.service';

/**
 * Academy Courses Component
 */
@Component({
  selector: 'app-academy-courses',
  templateUrl: './academy-courses.component.html',
  providers: [{ provide: API_URL, useValue: ApiConfig.aodCourses }],
})
export class AcademyCoursesComponent implements OnInit {
  courseComponent: any = AcademyCoursesListContainerComponent;
  config: UserDashboardListViewConfig;

  /**
   * @ignore
   */
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.setPageTitle(['Kursy', 'Akademia Otwartych Danych', 'Mój Pulpit']);

    this.setupListConfig();
  }

  private setupListConfig() {
    this.config = new UserDashboardListViewConfig.builder()
      .default()
      .withSort('start')
      .withFoundedItemsCountHeader('Aod.Courses')
      .withFilterConfig({
        filterType: AodCourseType,
        selectedFilters: [AodCourseType.PLANNED.toString(), AodCourseType.CURRENT.toString(), AodCourseType.FINISHED.toString()],
        title: 'Aod.CoursesStatus',
      })
      .build();
  }
}
