import { NextResponse } from "next/server"
import { client } from "@/sanity/lib/client"
import { INQUIRE_ONLY_QUERY } from "@/sanity/lib/queries"

export const config = {
    matcher: ["/((?!inquire|admin|api|_next|.*\\..*).*)"],
}

const TTL_MS = 60_000
const COOKIE_NAME = "preview"
const MAX_AGE = 60 * 60 * 24 * 30

let cache = { value: null, ts: 0 }

async function getInquireOnly() {
    if (Date.now() - cache.ts < TTL_MS) return cache.value
    const value = await client.fetch(INQUIRE_ONLY_QUERY)
    cache = { value, ts: Date.now() }
    return value
}

function passwordFromHeader(header) {
    if (!header?.startsWith("Basic ")) return null
    try {
        const decoded = atob(header.slice(6))
        const idx = decoded.indexOf(":")
        return idx === -1 ? null : decoded.slice(idx + 1)
    } catch {
        return null
    }
}

function challenge() {
    return new NextResponse("Unauthorized", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Preview"' },
    })
}

export async function proxy(request) {
    if (process.env.NODE_ENV !== "production") return NextResponse.next()

    const password = process.env.PREVIEW_PASSWORD

    if (password && request.cookies.get(COOKIE_NAME)?.value === password) {
        return NextResponse.next()
    }

    if (request.nextUrl.pathname === "/unlock") {
        if (password && passwordFromHeader(request.headers.get("authorization")) === password) {
            const response = NextResponse.redirect(new URL("/", request.url))
            response.cookies.set(COOKIE_NAME, password, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                maxAge: MAX_AGE,
                path: "/",
            })
            return response
        }
        return challenge()
    }

    if (await getInquireOnly()) {
        return NextResponse.redirect(new URL("/inquire", request.url))
    }
    return NextResponse.next()
}
