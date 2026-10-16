import { Component, Input } from '@angular/core';
import { IWidget } from '@app/services/models/cms/widgets/widget';
import { BehaviorSubject } from 'rxjs';
import { CmsBlock2Component } from '@app/shared/cms/cms-block2/cms-block2.component';
import { ExternalLinkInterceptorDirective } from '@app/shared/directives/external-link-interceptor.directive';
import {
  ILeaveDomainDialogData,
  LeaveDomainDialogComponent,
} from '@app/shared/leave-domain-dialog/leave-domain-dialog.component';
import { APP_CONFIG } from '@app/app.config';

@Component({
  selector: 'app-home-facebook-news',
  standalone: true,
  imports: [CmsBlock2Component, ExternalLinkInterceptorDirective],
  templateUrl: './facebook-news.component.html',
})
export class FacebookNewsComponent {
  protected readonly leaveDomainModal = LeaveDomainDialogComponent;

  protected readonly getLeaveDomainData = (): ILeaveDomainDialogData => ({
    titleKey: 'Footer.Facebook.Dialog.Title',
    bodyPrefixKey: 'Footer.Facebook.Dialog.BodyPrefix',
    siteLinkLabelKey: 'Footer.Facebook.Dialog.SiteLinkLabel',
    siteLinkUrl: APP_CONFIG.urls.daneGovPl,
    bodyMiddleKey: 'Footer.Facebook.Dialog.BodyMiddle',
    policyLinkLabelKey: 'Footer.Facebook.Dialog.PolicyLinkLabel',
    policyLinkUrl: APP_CONFIG.urls.metaPolicy,
    stayKey: 'Footer.Facebook.Dialog.Stay',
    proceedKey: 'Footer.Facebook.Dialog.Proceed',
    closeAriaKey: 'Footer.Facebook.Dialog.CloseAria',
  });

  @Input() public facebookWidget: BehaviorSubject<IWidget[]> =
    new BehaviorSubject<IWidget[]>(null);
}
