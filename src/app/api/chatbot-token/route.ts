import { API } from "@/utils/api";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {

    const apiKey = process.env.CHATBOT_API_KEY
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(":").at(-1) : request.ip;

    if (!apiKey) return new Response("API key not set", { status: 400 });
    if (!ip) return new Response("IP address not found", { status: 400 });

    const json = await API.chatbot.temptoken(apiKey, ip);

    return new Response(JSON.stringify(json), {
        headers: {
            "content-type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
        },
    });
}