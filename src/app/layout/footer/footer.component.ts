import { AsyncPipe, DOCUMENT, isPlatformBrowser, LowerCasePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { environment } from '@env/environment';
import { TranslatePipe } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import { APP_CONFIG } from '@app/app.config';
import { FooterLogosFilterService } from '@app/layout/footer/footer-logos-filter.service';
import { ApiConfig } from '@app/services/api';
import { CmsService } from '@app/services/cms.service';
import { IHome } from '@app/services/models/cms/pages/home';
import { IWidget } from '@app/services/models/cms/widgets/widget';
import { IWidgetSvg } from '@app/services/models/cms/widgets/widget-svg';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { CmsBlock2Component } from '@app/shared/cms/cms-block2/cms-block2.component';
import { CmsLandingPageComponent } from '@app/shared/cms/cms-landing-page/cms-landing-page.component';
import { FocusTrapDirective } from '@app/shared/directives/focus-trap/focus-trap.directive';
import packageJson from '../../../../package.json';
import { LocalStorageService } from 'ngx-localstorage';
import { RodoModalComponent } from '@app/shared/rodo-modal/rodo-modal.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [
    CmsLandingPageComponent,
    CmsBlock2Component,
    FocusTrapDirective,
    TranslatePipe,
    LowerCasePipe,
    AsyncPipe,
    RodoModalComponent,
  ],
  standalone: true,
})
export class FooterComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Router endpoints
   */
  readonly routerEndpoints = RouterEndpoints;
  isAcquintedWithRodo: boolean;

  /**
   * RODO modal reference
   */
  @ViewChild('rodoModalTemplate') rodoModalTemplate: TemplateRef<any>;
  rodoModalRef: BsModalRef;

  /**
   * write us modal reference
   */
  @ViewChild('writeUsModalTemplate', { static: false }) writeUsModalTemplate: TemplateRef<unknown>;
  writeUsModalRef: BsModalRef;

  /**
   * RODO modal hide subscription
   */
  rodoModalHideSubscription: Subscription;

  /**
   * App prefix in local storage
   */
  storagePrefix = 'OD';

  /**
   * Current version of app
   */
  currentVersion = packageJson.version;

  /**
   * App config
   */
  appConfig = APP_CONFIG;
  /**
   * Rdf documentation link
   * @type {string}
   */
  rdfDocumentationURL: string;
  /**
   * Widget subject for logos section and navigation section
   */
  cmsFooterLogoSection = new BehaviorSubject<IWidget[]>(null);
  cmsFooterNavigationPage = new BehaviorSubject<IWidget[]>(null);
  /**
   * Data from api for home data
   */
  private homeData: IHome;

  /**
   * @ignore
   */
  constructor(
    private modalService: BsModalService,
    private localStorage: LocalStorageService,
    public cmsService: CmsService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string,
    private footerLogosFilterService: FooterLogosFilterService,
  ) {}

  /**
   * Setups rdf documentation link
   */
  ngOnInit(): void {
    this.getRDFDocumentationURL();
    this.assignCmsSection();
    this.cmsService.elementFooterNavIsExist.pipe(take(1)).subscribe(() => {
      const writeUsLinkElem = this.document.querySelector('a.page-footer__list-item.btn-write-us');
      writeUsLinkElem.addEventListener('click', (e) => {
        e.preventDefault();
        this.writeUsModalRef = this.modalService.show(this.writeUsModalTemplate);
      });
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isAcquintedWithRodo = !!this.localStorage.get('isAcquintedWithRodo', { prefix: this.storagePrefix });

      if (this.isAcquintedWithRodo) {
        return;
      }

      setTimeout(() => {
        this.rodoModalOpen();
      });

      this.rodoModalHideSubscription = this.modalService.onHidden.subscribe(() => {
        this.localStorage.set('isAcquintedWithRodo', 'true', { prefix: this.storagePrefix });
        this.rodoModalRef = null;
      });
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId && this.rodoModalHideSubscription)) {
      this.rodoModalHideSubscription.unsubscribe();
    }
  }

  onWriteUsModalClose() {
    this.writeUsModalRef.hide();
    this.writeUsModalRef = null;
  }

  private rodoModalOpen() {
    this.rodoModalRef = this.modalService.show(this.rodoModalTemplate, { class: 'modal-lg' });
  }

  rodoModalClose() {
    this.rodoModalRef.hide();
  }

  /**
   * Setups rdf documentation link
   */
  private getRDFDocumentationURL(): void {
    let baseURL: string;
    if (!environment.production) {
      baseURL = '/api';
    } else {
      baseURL = this.document.location.protocol + '//api.' + this.document.location.hostname.replace('www.', '');
    }
    this.rdfDocumentationURL = baseURL + ApiConfig.apiVersion + ApiConfig.rdfDoc;
  }

  private assignCmsSection() {
    this.cmsService.getHomePageWidgets().subscribe((response: IHome) => {
      this.homeData = response;

      this.cmsFooterNavigationPage.next(this.homeData.footer_nav.blocks as IWidget[]);
      this.setFooterLogos();
    });
  }

  /**
   * Set footer images based on contrast
   */
  private setFooterLogos() {
    this.footerLogosFilterService
      .filter(this.homeData.footer_logos as IWidgetSvg[])
      .pipe(
        tap((footerLogos) => {
          this.cmsFooterLogoSection.next(footerLogos as IWidgetSvg[]);
        }),
      )
      .subscribe();
  }
}
