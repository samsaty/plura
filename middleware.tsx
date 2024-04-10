import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Define your public routes that should not require authentication
const publicRoutes = ['/site', '/ap/uploadthing'];


// Use authMiddleware with the publicRoutes configuration
export default authMiddleware({
    publicRoutes: publicRoutes,
    beforeAuth(auth, req) { },
    afterAuth(auth, req) {
        //rewrite for domains
        const url = req.nextUrl;
        const searchParams = url.searchParams.toString()
        let hostname = req.headers
        const pathwithSearchParams = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`

        //if subdomain exists
        const customSubDomain = hostname.get('host')?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`).filter(Boolean)[0];

        if (customSubDomain) {
            return NextResponse.rewrite(new URL(`/${customSubDomain}${pathwithSearchParams}`, req.url))
        }
        if (url.pathname == "/sign-in" || url.pathname == "/sign-up") {
            return NextResponse.redirect(new URL(`/agency/sign-in`, req.url))
        }

        if (url.pathname === "/" || url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAN) {
            return NextResponse.rewrite(new URL('/site', req.url))
        }
        if (url.pathname.startsWith('/agency') || url.pathname.startsWith('/subaccount')) {
            return NextResponse.rewrite(new URL(`${pathwithSearchParams}`, req.url))
        }
    },

})

// Optionally, you can define a custom configuration for Clerk's middleware
export const config = {
    matcher: [
        "/((?!.+\\.[\\w]+$|_next).*)",
        "/",
        "/(api|trpc)(.*)",
        ...publicRoutes.map(route => `/${route}(\\/.*)?`), // Include public routes in the matcher
    ],
};
