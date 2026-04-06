export class UserDashboardListViewFilterType {
  constructor(
    public readonly value: string,
    public readonly description: string,
  ) {}

  public static getTypes(): UserDashboardListViewFilterType[] {
    return [];
  }

  toString(): string {
    return this.value;
  }
}
