import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { AppBootstrapModule } from '@app/app-bootstrap/app-bootstrap.module';
import { LoginComponent } from '@app/user/auth/login/login.component';
import { RegisterComponent } from '@app/user/auth/register/register.component';
import { MyAccountComponent } from '@app/user/my-account/my-account.component';

import { FollowedComponent } from './my-account/followed/followed.component';
import { SearchHistoryComponent } from './my-account/search-history/search-history.component';
import { ActivityComponent } from './my-account/activity/activity.component';
import { LostPasswordComponent } from './auth/lost-password/lost-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { ChangePasswordComponent } from './my-account/change-password/change-password.component';
import { FollowedApplicationComponent } from '@app/user/my-account/followed/followed-application/followed-application.component';
import { FollowedArticleComponent } from '@app/user/my-account/followed/followed-article/followed-article.component';
import { FollowedDatasetComponent } from '@app/user/my-account/followed/followed-dataset/followed-dataset.component';

@NgModule({
    imports: [
        CommonModule,
        UserRoutingModule,
        AppBootstrapModule,
        TranslateModule.forChild({parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser
            }}),
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    declarations: [
        LoginComponent,
        RegisterComponent,
        MyAccountComponent,
        FollowedComponent,
        SearchHistoryComponent,
        ActivityComponent,
        FollowedDatasetComponent,
        FollowedApplicationComponent,
        FollowedArticleComponent,
        LostPasswordComponent,
        ResetPasswordComponent,
        VerifyEmailComponent,
        ChangePasswordComponent
    ],
    providers: [
    ]
})
export class UserModule {
}
