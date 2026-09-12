import { firstValueFrom, from, Observable } from 'rxjs';
import { PocoToFormPayload, PoCoToSubmitValue } from '@app/shared/forms/form-pages/po-co-to-form/po-co-to-form-models';
import { inject, Injectable } from '@angular/core';
import { ApplicationsService } from '@app/services/applications.service';
import { FileUtilsService } from '@app/services/file-utils.service';
import { switchMap } from 'rxjs/operators';
import { ApiResponse } from '@app/services/api';
import { removeEmptyFields } from '@app/shared/forms/utils/remove-empty-fields';

@Injectable()
export class PoCoToFormFacade {
  private readonly applicationsService = inject(ApplicationsService);
  private readonly fileUtilsService = inject(FileUtilsService);

  submitForm(formValue: PoCoToSubmitValue): Observable<ApiResponse> {
    return from(this.buildPayload(formValue)).pipe(switchMap((payload) => this.applicationsService.suggest(payload)));
  }

  private async buildPayload(formValue: PoCoToSubmitValue): Promise<PocoToFormPayload> {
    if (formValue.poCoToFields?.url) {
      formValue.poCoToFields.url = this.addHttpIfMissing(formValue.poCoToFields.url);
    }

    let mappedKeywords = [];
    if (formValue.poCoToFields?.keywords?.length) {
      mappedKeywords = formValue.poCoToFields.keywords
        .toString()
        .split(',')
        .filter(Boolean)
        .map((keyword: string) => keyword.trim());
    }

    if (formValue.poCoToFields?.externalDatasets?.length) {
      formValue.poCoToFields.externalDatasets = formValue.poCoToFields.externalDatasets.filter((item) => {
        if (item.title && item.url) {
          item.url = this.addHttpIfMissing(item.url);
          return item;
        } else if (item.title && !item.url) {
          delete item.url;
          return item;
        } else if (!item.title && item.url) {
          item.url = this.addHttpIfMissing(item.url);
          delete item.title;
          return item;
        }
      });
    }

    if (formValue.poCoToFields?.desktopAppGroup) {
      formValue.poCoToFields.desktopAppGroup.linuxLink = formValue.poCoToFields.desktopAppGroup.linuxLink
        ? this.addHttpIfMissing(formValue.poCoToFields.desktopAppGroup.linuxLink)
        : '';
      formValue.poCoToFields.desktopAppGroup.macLink = formValue.poCoToFields.desktopAppGroup.macLink
        ? this.addHttpIfMissing(formValue.poCoToFields.desktopAppGroup.macLink)
        : '';
      formValue.poCoToFields.desktopAppGroup.windowsLink = formValue.poCoToFields.desktopAppGroup.windowsLink
        ? this.addHttpIfMissing(formValue.poCoToFields.desktopAppGroup.windowsLink)
        : '';
    }

    if (formValue.poCoToFields?.mobileAppGroup) {
      formValue.poCoToFields.mobileAppGroup.appleLink = formValue.poCoToFields.mobileAppGroup.appleLink
        ? this.addHttpIfMissing(formValue.poCoToFields.mobileAppGroup.appleLink)
        : '';
      formValue.poCoToFields.mobileAppGroup.androidLink = formValue.poCoToFields.mobileAppGroup.androidLink
        ? this.addHttpIfMissing(formValue.poCoToFields.mobileAppGroup.androidLink)
        : '';
    }

    const [illustrativeGraphics, image] = await Promise.all([
      formValue.poCoToFields?.illustrativeGraphics
        ? firstValueFrom(this.fileUtilsService.convertFileToBase64(formValue.poCoToFields.illustrativeGraphics))
        : Promise.resolve<undefined>(undefined),
      formValue.poCoToFields?.logoImage
        ? firstValueFrom(this.fileUtilsService.convertFileToBase64(formValue.poCoToFields.logoImage))
        : Promise.resolve<undefined>(undefined),
    ]);

    return removeEmptyFields({
      applicant_email: formValue.nameEmail?.email,
      applicant_full_name: formValue.nameEmail?.name,
      author: formValue.poCoToFields?.author,
      category: formValue.poCoToFields?.category,
      datasets: [...new Set(formValue.poCoToFields?.datasets.filter(Boolean).map((item) => item.id))],
      desktop_linux_url: formValue.poCoToFields?.desktopAppGroup.linuxLink,
      desktop_macos_url: formValue.poCoToFields?.desktopAppGroup.macLink,
      desktop_windows_url: formValue.poCoToFields?.desktopAppGroup.windowsLink,
      external_datasets: formValue.poCoToFields?.externalDatasets,
      illustrative_graphics: illustrativeGraphics,
      image,
      is_desktop_app: formValue.poCoToFields?.desktopAppGroup.isDesktopApp,
      is_mobile_app: formValue.poCoToFields?.mobileAppGroup.isMobileApp,
      is_personal_data_processing_accepted: formValue.poCoToFields?.personalDataAccepted,
      is_terms_of_service_accepted: formValue.poCoToFields?.tosAccepted,
      keywords: mappedKeywords,
      license_type: formValue.poCoToFields?.licenseType,
      mobile_apple_url: formValue.poCoToFields?.mobileAppGroup.appleLink,
      mobile_google_url: formValue.poCoToFields?.mobileAppGroup.androidLink,
      notes: formValue.poCoToFields?.description,
      title: formValue.poCoToFields?.name,
      url: formValue.poCoToFields?.url,
    });
  }

  private addHttpIfMissing(url: string): string {
    if (url.split('http://').length > 1 || url.split('https://').length > 1) {
      return url;
    } else {
      return 'http://' + url;
    }
  }
}
