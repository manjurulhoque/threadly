import { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DecodedJWT } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";

async function customAuthenticationFunction(credentials: any) {
    try {
        // Call your FastAPI endpoint for user authentication
        const response = await fetch(`${process.env.BACKEND_BASE_URL}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        if (response.ok) {
            return await response.json();
        } else {
            // Return null if authentication fails
            return null;
        }
    } catch (error) {
        console.error("Error during authentication:", error);
        return null;
    }
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            // The name to display on the sign-in form (e.g., 'Sign in with...')
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials, req) {
                // Fetch user from your API
                const result = await customAuthenticationFunction(credentials);

                if (result) {
                    const {
                        user_id,
                        email,
                        is_admin,
                        name,
                        exp,
                    }: DecodedJWT = jwtDecode(result.access);

                    const user = {
                        ...result,
                        exp,
                        user: {
                            id: user_id,
                            email,
                            is_admin,
                            name
                        },
                    } as User;

                    // Any user object returned here will be set in the session for the user
                    return Promise.resolve(user);
                } else {
                    // If the credentials are invalid, return null
                    return Promise.resolve(null);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.id = user.id;
                token.refresh = user.refresh;
                token.access = user.access;
                token.exp = user.exp;
                token.user = {
                    ...user.user,
                    is_admin: user.user.is_admin,
                }
            }
            return token;
        },
        async session({session, token, user}) {
            session.access = token.access;
            session.exp = token.exp;
            session.refresh = token.refresh;
            session.user = token.user;
            // session.user.id = token.id;
            if (token?.user?.is_admin) {
                session.user.is_admin = token.user.is_admin;
            }
            return session;
        },
        async redirect({url, baseUrl}) {
            return baseUrl;
        },
    },
    pages: {
        error: "/login",
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
    session: {
        strategy: "jwt",
        maxAge: 1 * 24 * 60 * 60, // 7 Days
    },
};