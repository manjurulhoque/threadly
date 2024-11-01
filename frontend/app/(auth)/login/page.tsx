import type { Metadata } from "next";
import Login from "@/components/auth/Login";

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account",
}

const Page = () => {
    return (
        <Login/>
    );
}

export default Page;
