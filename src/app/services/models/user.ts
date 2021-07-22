export interface User {
    id: number;
    attributes: {
        email: string;
        fullname: string;
        token: string;
        created: string;
        state: string; // 'active' | 'deleted' | 'draft' | 'pending' | 'blocked';
        subscriptions_report_opt_in: boolean;
    };
    institutions?: {id: string, title: string}[];
    agent_institutions?: {id: string, title: string}[];
}
