import type { User, UserObject } from 'next-auth';
import type { Token } from 'next-auth/jwt';

declare module 'next-auth' {
    export interface UserObject {
        id?: string;
        name?: string;
        email?: string;
        is_admin?: boolean;
    }

    /**
     * The shape of the user object returned in the OAuth providers' `profile` callback,
     * or the second parameter of the `session` callback, when using a database.
     */
    export interface User extends Token {
        refresh: string;
        access: string;
        exp: number;
        user: UserObject;
    }

    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    export interface Session extends User {
        expires: string;
        user: UserObject;
    }
}

declare module 'next-auth/jwt' {
    export interface RefreshedToken {
        access: string;
    }

    export interface Token extends RefreshedToken {
        refresh: string;
    }

    /**
     * Returned by the `jwt` callback and `getToken`, when using JWT sessions
     */
    export interface JWT extends User {
        iat: number;
        jti: string;
    }

    export interface DecodedJWT extends UserObject {
        user_id: string | number;
        exp: number;
        iat: number;
        jti: string;
        sub: string;
        name: string;
        email: string;
        is_admin: boolean;
    }
}
