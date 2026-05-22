import { NextResponse } from "next/server"
import { client } from "@/sanity/lib/client"
import { INQUIRE_ONLY_QUERY } from "@/sanity/lib/queries"

export const config = {
    matcher: ["/((?!inquire|admin|api|_next|.*\\..*).*)"],
}

const TTL_MS = 60_000
let cache = { value: null, ts: 0 }

async function getInquireOnly() {
    if (Date.now() - cache.ts < TTL_MS) return cache.value
    const value = await client.fetch(INQUIRE_ONLY_QUERY)
    cache = { value, ts: Date.now() }
    return value
}

export async function proxy(request) {
    if (process.env.NODE_ENV !== "production") return NextResponse.next()

    if (await getInquireOnly()) {
        return NextResponse.redirect(new URL("/inquire", request.url))
    }
    return NextResponse.next()
}
