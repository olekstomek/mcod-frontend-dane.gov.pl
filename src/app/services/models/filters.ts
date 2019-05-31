export interface IFilters {
    sort?: string;
    per_page?: number;
    page?: number;
    q?: string;
    tags?: string;
    [filter: string]: any;
}
