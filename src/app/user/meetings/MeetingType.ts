import { UserDashboardListViewFilterType } from '@app/user/list-view/UserDashboardListViewFilterType';

export class MeetingType extends UserDashboardListViewFilterType {

    static PLANNED = new MeetingType('planned', 'Planowane');
    static FINISHED = new MeetingType('finished', 'Zakończone');

    public static getTypes(): Array<MeetingType> {
        return [MeetingType.PLANNED, MeetingType.FINISHED];
    }

}
