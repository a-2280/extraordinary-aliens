export default function sanityLoader({ src, width, quality }) {
    if (!src?.includes("cdn.sanity.io")) return src
    const params = new URLSearchParams({
        w: String(width),
        q: String(quality ?? 75),
        auto: "format",
        fit: "max",
    })
    return `${src.split("?")[0]}?${params.toString()}`
}
