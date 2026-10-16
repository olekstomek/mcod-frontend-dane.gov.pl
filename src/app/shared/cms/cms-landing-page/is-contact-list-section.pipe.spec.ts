import { IWidget } from '@app/services/models/cms/widgets/widget';
import { WidgetType } from '@app/services/models/cms/widgets/widget-type';

import { IsContactListSectionPipe } from './is-contact-list-section.pipe';

function widget(classes = ''): IWidget {
  return {
    general: {
      margin: { unit: 'px', left: 0, top: 0, right: 0, bottom: 0 },
      padding: { unit: 'px', left: 0, top: 0, right: 0, bottom: 0 },
      backgroundColor: { r: 0, g: 0, b: 0, a: 0 },
      foregroundColor: { r: 0, g: 0, b: 0, a: 0 },
      style: '',
      textAlignment: '',
      classes,
    },
    type: WidgetType.TEXT,
    id: '1',
  };
}

describe('IsContactListSectionPipe', () => {
  const pipe = new IsContactListSectionPipe();

  it('returns false when context is not footer', () => {
    const section = widget('page-footer__nav-title nav-3');

    const result = pipe.transform(section, 'page');

    expect(result).toBe(false);
  });

  it('returns true when context is footer and classes match the contact title', () => {
    const section = widget('page-footer__nav-title nav-3');

    const result = pipe.transform(section, 'footer');

    expect(result).toBe(true);
  });

  it('returns false for the contact list widget (page-footer__nav)', () => {
    const section = widget('page-footer__nav nav-3');

    const result = pipe.transform(section, 'footer');

    expect(result).toBe(false);
  });

  it('returns false for other footer nav title columns without nav-3', () => {
    const section = widget('page-footer__nav-title nav-1');

    const result = pipe.transform(section, 'footer');

    expect(result).toBe(false);
  });

  it('returns false when section has no general classes', () => {
    const section = widget('');

    const result = pipe.transform(section, 'footer');

    expect(result).toBe(false);
  });

  it('returns false when section is null', () => {
    const result = pipe.transform(null, 'footer');

    expect(result).toBe(false);
  });
});
