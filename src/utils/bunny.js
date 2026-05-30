// Helpers for Bunny Stream playback.
//
// Editors paste a Bunny Stream video GUID into Sanity (the `bunnyVideoId`
// fields). We build playback URLs from that GUID plus the library's CDN
// hostname (e.g. vz-xxxxxxxx.b-cdn.net), set via
// NEXT_PUBLIC_BUNNY_STREAM_HOSTNAME.
//
// Two playback modes:
//  - Long-form video (the hero modal): adaptive HLS via bunnyHlsUrl().
//  - Short muted background loops (grids, carousels, hovers): a direct MP4
//    via bunnyMp4Url(), so many clips on one page stay lightweight. This
//    requires "MP4 Fallback" to be enabled in the Bunny library settings.

export const BUNNY_STREAM_HOSTNAME =
    process.env.NEXT_PUBLIC_BUNNY_STREAM_HOSTNAME

// Resolution used for background loop clips (MP4 fallback). Must be a tier the
// Bunny library actually encodes; 720p is a safe default for decorative loops.
const LOOP_RESOLUTION =
    process.env.NEXT_PUBLIC_BUNNY_LOOP_RESOLUTION || "720p"

export function bunnyHlsUrl(videoId) {
    if (!videoId || !BUNNY_STREAM_HOSTNAME) return null
    return `https://${BUNNY_STREAM_HOSTNAME}/${videoId}/playlist.m3u8`
}

export function bunnyMp4Url(videoId, resolution = LOOP_RESOLUTION) {
    if (!videoId || !BUNNY_STREAM_HOSTNAME) return null
    return `https://${BUNNY_STREAM_HOSTNAME}/${videoId}/play_${resolution}.mp4`
}

export function bunnyThumbUrl(videoId) {
    if (!videoId || !BUNNY_STREAM_HOSTNAME) return null
    return `https://${BUNNY_STREAM_HOSTNAME}/${videoId}/thumbnail.jpg`
}

// Resolve the best <video src> for an autoplay/loop background clip from an
// object that may carry a Bunny id and/or a legacy Sanity asset url.
// Prefers Bunny; falls back to the existing Sanity url so old content keeps working.
export function loopVideoSrc({ video, bunnyVideoId } = {}) {
    return bunnyMp4Url(bunnyVideoId) || video || null
}

// True when an object has playable video from either source.
export function hasVideo({ video, bunnyVideoId } = {}) {
    return Boolean(bunnyMp4Url(bunnyVideoId) || video)
}
