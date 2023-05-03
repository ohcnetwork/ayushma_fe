import { NextResponse } from "next/server";

export async function GET(request: Request, response: Response) {

    const searchParams = new URL(request.url).searchParams;
    const url = searchParams.get("url");
    const res = await fetch(url || "https://google.com");
    //return NextResponse.pr;
}