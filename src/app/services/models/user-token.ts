export interface UserToken {
    user: {
        session_key: string,
        email: string,
        role: string
    };
    iat: number;
    exp: number;
    nbf: number;
}
