export class ApiResponse {
    constructor(response) {
        this._results = response['data'];
        this._count = response['meta']['count'];
        this._filters = response['meta']['aggs'];
        this._institutions = response['included'];
        this._links = response['links'];
    }

    private _links: any;

    get links(): any {
        return this._links;
    }

    private _institutions: any = [];

    get institutions(): any {
        return this._institutions;
    }

    private _results = [];

    get results(): any[] {
        return this._results;
    }

    private _count = 0;

    get count(): number {
        return this._count;
    }

    private _filters = {};

    get filters(): {} {
        return this._filters;
    }
}
