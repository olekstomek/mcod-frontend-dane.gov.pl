export interface User {
    id: number;
    attributes: {
        email: string;
        fullname: string;
        token: string;
        state: string; // 'active' | 'deleted' | 'draft' | 'pending' | 'blocked';
    };
}
