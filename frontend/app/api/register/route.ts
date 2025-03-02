import { NextResponse } from "next/server";
import httpStatus from "@/lib/http-status";

type ResponseData = {
    error: string;
    errors: Record<string, string>[];
}

interface RequestBody {
    username: string;
    name: string;
    email: string;
    password: string;
}

export async function POST(req: Request) {
    const {username, name, email, password}: RequestBody = await req.json();

    const response = await fetch(`${process.env.BACKEND_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username, name, email, password}),
    });

    if (response.ok) {
        return NextResponse.json({message: "User created successfully"}, {status: httpStatus.CREATED});
    }

    let res = await response.json();
    console.log(res);
    // Handle errors
    const errorData: ResponseData = res;
    if (errorData.errors?.length > 0) {
        return NextResponse.json({message: errorData.errors[0]}, {status: response.status});
    }
    const errorMessage = errorData.error || "Something went wrong";
    return NextResponse.json({message: errorMessage}, {status: response.status});
}