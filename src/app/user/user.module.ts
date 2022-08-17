import { A11yModule } from '@angular/cdk/a11y';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatepickerModule } from '@app/shared/datepicker/datepicker.module';
import { UserDashboardListViewBaseComponent } from '@app/user/list-view/user-dashboard-list-view-base.component';
import { ScheduleButtonComponent } from '@app/user/schedule/table/components/schedule-button-component/schedule-button.component';
import { ScheduleLinkComponent } from '@app/user/schedule/table/components/schedule-link-component/schedule-link.component';
import { ScheduleArchiveComponent } from '@app/user/schedule/tabs/archive/schedule-archive.component';
import { ScheduleStatusComponent } from '@app/user/schedule/components/schedule-status/schedule-status.component';
import { ScheduleInProgressComponent } from '@app/user/schedule/tabs/in-progress/schedule-in-progress.component';
import { ScheduleSearchSuggestComponent } from '@app/user/schedule/tabs/planning/components/search-suggest/schedule-search-suggest.component';
import { ScheduleComponent } from '@app/user/schedule/schedule.component';
import { ScheduleTabComponent } from '@app/user/schedule/tab/schedule-tab.component';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { UserRoutingModule } from '@app/user/user-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { AppBootstrapModule } from '@app/app-bootstrap/app-bootstrap.module';
import { LoginComponent } from '@app/user/auth/login/login.component';
import { RegisterComponent } from '@app/user/auth/register/register.component';

import { SearchHistoryComponent } from '@app/user/search-history/search-history.component';
import { LostPasswordComponent } from '@app/user/auth/lost-password/lost-password.component';
import { ResetPasswordComponent } from '@app/user/auth/reset-password/reset-password.component';
import { VerifyEmailComponent } from '@app/user/auth/verify-email/verify-email.component';
import { ChangePasswordComponent } from '@app/user/change-password/change-password.component';

import { FollowedComponent } from '@app/user/followed/followed.component';
import { FollowedQueryComponent } from '@app/user/followed/followed-query/followed-query.component';
import { FollowedObjectTabsComponent } from '@app/user/followed/followed-object-tabs/followed-object-tabs.component';
import { FollowedObjectActivityComponent } from '@app/user/followed/followed-object-activity/followed-object-activity.component';
import { FollowedEmailNotificationConsentComponent } from '@app/user/followed/followed-email-notification-consent/followed-email-notification-consent.component';
import { FollowQueryResultsComponent } from '@app/user/followed/follow-query-results/follow-query-results.component';
import { MyFollowedComponent } from '@app/user/my-followed/my-followed.component';
import { FollowedDatasetsComponent } from '@app/user/followed/followed-datasets/followed-datasets.component';

import { VisualPasswordValidatorComponent } from '@app/user/auth/visual-password-validator/visual-password-validator.component';
import { DashboardComponent } from '@app/user/dashboard/dashboard.component';
import { LabComponent } from '@app/user/lab/lab.component';
import { AcademyComponent } from '@app/user/academy/academy.component';
import { MyDashboardComponent } from '@app/user/my-dashboard/my-dashboard.component';
import { AcademyInfoComponent } from '@app/user/academy/academy-info/academy-info.component';
import { AcademyCoursesComponent } from '@app/user/academy/academy-courses/academy-courses.component';
import { LabInfoComponent } from '@app/user/lab/lab-info/lab-info.component';
import { LabAnalysesComponent } from '@app/user/lab/lab-analyses/lab-analyses.component';
import { LabResearchesComponent } from '@app/user/lab/lab-researches/lab-researches.component';
import { LabListComponent } from '@app/user/lab/lab-list/lab-list.component';
import { AcademyScheduleComponent } from '@app/user/academy/academy-courses/academy-schedule/academy-schedule.component';
import { LabListItemComponent } from '@app/user/lab/lab-list/lab-list-item/lab-list-item.component';
import { LabListReportButtonComponent } from '@app/user/lab/lab-list/lab-list-item/lab-list-report-button/lab-list-report-button.component';
import { DataProposalComponent } from '@app/user/data-proposal/data-proposal.component';
import { ActiveDataProposalComponent } from '@app/user/data-proposal/active/active-data-proposal.component';
import { InactiveDataProposalComponent } from '@app/user/data-proposal/inactive/inactive-data-proposal.component';
import { DataProposalListComponent } from '@app/user/data-proposal/list/data-proposal-list.component';
import { DataProposalListItemComponent } from '@app/user/data-proposal/list/data-proposal-list-item/data-proposal-list-item.component';
import { DashboardStatsComponent } from '@app/user/stats/dashboard-stats.component';
import { UserDashboardListViewComponent } from '@app/user/list-view/user-dashboard-list-view.component';
import { AcademyCoursesListContainerComponent } from '@app/user/academy/academy-courses/academy-courses-list/academy-courses-list-container.component';
import { AcademyCourseComponent } from '@app/user/academy/academy-courses/academy-course/academy-course.component';
import { LabListContainerComponent } from '@app/user/lab/lab-list/lab-list-container/lab-list-container.component';
import { DataProposalListContainerComponent } from '@app/user/data-proposal/list/list-container/data-proposal-list-container.component';
import { DataProposalDetailsComponent } from '@app/user/data-proposal/details/data-proposal-details.component';
import { DataProposalTabComponent } from '@app/user/data-proposal/tab/data-proposal-tab.component';
import { MeetingsListContainerComponent } from '@app/user/meetings/meetings-list/meetings-list-container.component';
import { MeetingsComponent } from '@app/user/meetings/meetings.component';
import { MeetingListItemComponent } from '@app/user/meetings/meeting-list-item/meeting-list-item.component';
import { ScheduleNotificationPopupComponent } from './schedule/schedule-notification-popup/schedule-notification-popup.component';
import { SchedulePlanningFormComponent } from './schedule/forms/schedule-planning-form/schedule-planning-form.component';
import { ScheduleSettingsFormComponent } from './schedule/forms/schedule-settings-form/schedule-settings-form.component';
import { ScheduleNotificationsFormComponent } from './schedule/forms/schedule-notifications-form/schedule-notifications-form.component';
import { ScheduleNotificationsSwitch } from './schedule/schedule-settings/schedule-notifications-switch.component';
import { ScheduleTableComponent } from './schedule/table/schedule-table.component';
import { ConfirmationModalComponent } from './schedule/table/components/confirmation-modal/confirmation-modal.component';
import { ScheduleTableExportComponent } from './schedule/table/components/schedule-table-eport/schedule-table-export.component';
import { SchedulePlanningComponent } from './schedule/tabs/planning/schedule-planning.component';
import { ScheduleStatusSwitcherComponent } from './schedule/components/schedule-status-switcher/schedule-status-switcher.component';
import { ScheduleCustomDropdownDirective } from './schedule/forms/schedule-custom-dropdown.directive';
import { ScheduleCommentsComponent } from './schedule/components/schedule-comments/schedule-comments.component';
import { ScheduleCommentsFormComponent } from './schedule/components/schedule-comments/schedule-comments-form/schedule-comments-form.component';
import { ScheduleCommentsListComponent } from './schedule/components/schedule-comments/schedule-comments-list/schedule-comments-list.component';
import { ForumRegulationsComponent } from './forum-regulations/forum-regulations.component';
import { LogoutComponent } from '@app/user/auth/logout/logout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    AppBootstrapModule,
    TranslateModule.forChild({
      parser: {
        provide: TranslateParser,
        useClass: TranslateICUParser,
      },
    }),
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    DatepickerModule,
    FontAwesomeModule,
    A11yModule,
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    FollowedComponent,
    SearchHistoryComponent,
    LostPasswordComponent,
    ResetPasswordComponent,
    VerifyEmailComponent,
    ChangePasswordComponent,
    FollowedQueryComponent,
    FollowedObjectTabsComponent,
    FollowedObjectActivityComponent,
    FollowedEmailNotificationConsentComponent,
    VisualPasswordValidatorComponent,
    FollowQueryResultsComponent,
    DashboardComponent,
    LabComponent,
    AcademyComponent,
    MyDashboardComponent,
    AcademyInfoComponent,
    AcademyCoursesListContainerComponent,
    LabInfoComponent,
    LabAnalysesComponent,
    LabResearchesComponent,
    LabListComponent,
    LabListItemComponent,
    LabListReportButtonComponent,
    AcademyCoursesComponent,
    AcademyCourseComponent,
    AcademyScheduleComponent,
    MyFollowedComponent,
    FollowedDatasetsComponent,
    DataProposalComponent,
    ActiveDataProposalComponent,
    InactiveDataProposalComponent,
    DataProposalListComponent,
    DataProposalListItemComponent,
    DashboardStatsComponent,
    DataProposalListContainerComponent,
    UserDashboardListViewComponent,
    UserDashboardListViewBaseComponent,
    LabListContainerComponent,
    MeetingsListContainerComponent,
    MeetingsComponent,
    MeetingListItemComponent,
    LabListContainerComponent,
    DataProposalDetailsComponent,
    DataProposalTabComponent,
    ScheduleNotificationPopupComponent,
    SchedulePlanningFormComponent,
    ScheduleSettingsFormComponent,
    ScheduleNotificationsFormComponent,
    ScheduleNotificationsSwitch,
    ScheduleTableComponent,
    ConfirmationModalComponent,
    ScheduleTableExportComponent,
    ScheduleComponent,
    ScheduleTabComponent,
    SchedulePlanningComponent,
    ScheduleInProgressComponent,
    ScheduleArchiveComponent,
    ScheduleStatusSwitcherComponent,
    ScheduleSearchSuggestComponent,
    ScheduleStatusComponent,
    ScheduleLinkComponent,
    ScheduleButtonComponent,
    ScheduleCustomDropdownDirective,
    ScheduleCommentsComponent,
    ScheduleCommentsFormComponent,
    ScheduleCommentsListComponent,
    ForumRegulationsComponent,
    LogoutComponent,
  ],
})
export class UserModule {}
