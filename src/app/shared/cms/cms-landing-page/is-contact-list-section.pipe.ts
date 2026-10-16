import { Pipe, PipeTransform } from '@angular/core';

import { IWidget } from '@app/services/models/cms/widgets/widget';

import { CmsLandingPageContext } from './cms-landing-page.context';

@Pipe({
  name: 'isContactListSection',
  standalone: true,
})
export class IsContactListSectionPipe implements PipeTransform {
  transform(section: IWidget | null | undefined, context: CmsLandingPageContext): boolean {
    if (context !== 'footer' || !section) {
      return false;
    }
    const classes = section.general?.classes;
    if (!classes) {
      return false;
    }
    const tokens = classes.split(/\s+/).filter(Boolean);
    return tokens.includes('page-footer__nav-title') && tokens.includes('nav-3');
  }
}
