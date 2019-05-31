import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '@app/user/auth/login/login.component';
import { RegisterComponent } from '@app/user/auth/register/register.component';
import { MyAccountComponent } from '@app/user/my-account/my-account.component';
import { ActivityComponent } from '@app/user/my-account/activity/activity.component';
import { SearchHistoryComponent } from '@app/user/my-account/search-history/search-history.component';
import { FollowedComponent } from '@app/user/my-account/followed/followed.component';
import { LostPasswordComponent } from './auth/lost-password/lost-password.component';
import { ResetPasswordComponent } from '@app/user/auth/reset-password/reset-password.component';
import { VerifyEmailComponent } from '@app/user/auth/verify-email/verify-email.component';
import { AuthGuard } from '@app/user/auth/auth.guard';
import { ChangePasswordComponent } from './my-account/change-password/change-password.component';
import { FollowedApplicationComponent } from '@app/user/my-account/followed/followed-application/followed-application.component';
import { FollowedArticleComponent } from '@app/user/my-account/followed/followed-article/followed-article.component';
import { FollowedDatasetComponent } from '@app/user/my-account/followed/followed-dataset/followed-dataset.component';

const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'lost-password', component: LostPasswordComponent},
    {path: 'reset-password/:token', component: ResetPasswordComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
    {path: 'verify-email/:token', component: VerifyEmailComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'myaccount/change-password', component: ChangePasswordComponent, canActivate: [AuthGuard]},
    {path: 'myaccount', component: MyAccountComponent,
        canActivate: [AuthGuard],
        children: [
            {path: '', redirectTo: 'activity', pathMatch: 'full'},
            {path: 'activity', component: ActivityComponent},
            {path: 'search-history', component: SearchHistoryComponent}, {
                path: 'followed', component: FollowedComponent, children: [
                    {path: '', redirectTo: 'dataset', pathMatch: 'full'},
                    {path: 'dataset', component: FollowedDatasetComponent},
                    {path: 'application', component: FollowedApplicationComponent},
                    {path: 'article', component: FollowedArticleComponent},
                    {path: '**', redirectTo: 'dataset'}]
            },
            {path: '**', redirectTo: 'activity'}
        ]
    }];

/**
 * @ignore
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
