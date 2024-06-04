import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { useState } from "react";

export default async function middleware(req: any, res: any) {

    
    let verify = req.cookies.get("token");
    let url = req.url;

    try {
        if (!verify )
        {
            if (url.includes("/User/dashboard") || url.includes("/User/Profile") || url.includes("/User/friends") || url.includes("/chat") || url.includes("/game") || url.includes("/User/update") || url.includes("/User/chack2FA") || url.includes("/User/dashboard")) {
                return NextResponse.redirect("http://localhost:3000/");
            }
        }else{
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/middleware`,  {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({token: verify.value}),
            });
            const data = await response.json();
            if (data.message === "Token is not valid" && (url.includes("/User/dashboard") || url.includes("/User/Profile") || url.includes("/User/friends") || url.includes("/chat") || url.includes("/game") || url.includes("/User/update") || url.includes("/User/chack2FA") || url.includes("/User/dashboard")))
            {
                return NextResponse.redirect("http://localhost:3000/");
            }
            if (data.message === "Token is valid" && (url === "http://localhost:3000/signin" || url === "http://localhost:3000/signup" || url === "http://localhost:3000/"))
            {
                return NextResponse.redirect("http://localhost:3000/User/dashboard");
            }
        }
    }
    catch (error) {}
    

}
