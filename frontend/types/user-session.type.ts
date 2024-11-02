export interface UserSession {
    refresh: string;
    access: string;
    exp: number;
    user: {
        id: number;
        email: string;
        name: string;
    };
}
