import { ScheduleTableLinkAction } from '@app/user/schedule/table/domain/actions/ScheduleTableLinkAction';

export class ScheduleTableViewDetailsAction extends ScheduleTableLinkAction {
  /**
   * Icon name
   * @type {string}
   */
  iconName = 'view-details';

  /**
   * Title translation key
   * @type {string}
   */
  titleTranslationKey = 'Attribute.Details';
}
