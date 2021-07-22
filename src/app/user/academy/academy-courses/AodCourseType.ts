import { UserDashboardListViewFilterType } from '@app/user/list-view/UserDashboardListViewFilterType';

export class AodCourseType extends UserDashboardListViewFilterType {
    static PLANNED = new AodCourseType('planned', 'Planowane');
    static CURRENT = new AodCourseType('current', 'W trakcie');
    static FINISHED = new AodCourseType('finished', 'Zakończone');

    static getTypes(): Array<AodCourseType> {
        return [AodCourseType.PLANNED, AodCourseType.CURRENT, AodCourseType.FINISHED];
    }
}
