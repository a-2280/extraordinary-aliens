import { client } from './client'
import { bunnyMp4Url } from '../../utils/bunny'
import {
    HERO_QUERY,
    LAYOUT_QUERY,
    PROJECTS_QUERY,
    PROJECT_SLUGS_QUERY,
    PROJECT_NAV_QUERY,
    PROJECT_BY_SLUG_QUERY,
    FEATURED_QUERY,
    MISSION_QUERY,
    SPECIAL_PROJECTS_QUERY,
    SPECIAL_PROJECT_PAGES_QUERY,
    SPECIAL_PROJECT_PAGE_SLUGS_QUERY,
    SPECIAL_PROJECT_PAGE_NAV_QUERY,
    SPECIAL_PROJECT_PAGE_BY_SLUG_QUERY,
    SPECIAL_PROJECTS_LANDING_QUERY,
    ABOUT_QUERY,
    INQUIRE_QUERY,
    INQUIRE_ONLY_QUERY,
    CONTACT_CTA_QUERY,
} from './queries'

const options = { next: { revalidate: 60 } }

// Pairs of [resolved-url field, Bunny-id field] that may sit on the same object.
const BUNNY_PAIRS = [
    ['video', 'bunnyVideoId'],
    ['heroVideo', 'heroBunnyVideoId'],
    ['footerVideo', 'footerBunnyVideoId'],
    ['locationVideo', 'locationBunnyVideoId'],
]

// Walk query results and, wherever an editor supplied a Bunny video ID, swap the
// resolved url over to Bunny's direct MP4 (for the lightweight autoplay loops).
// The id is left in place so the long-form hero modal can build an HLS url from
// it. If no Bunny hostname is configured, bunnyMp4Url() returns null and the
// original Sanity url is kept — nothing breaks before the CDN is wired up.
function resolveBunnyVideos(data) {
    if (Array.isArray(data)) return data.map(resolveBunnyVideos)
    if (!data || typeof data !== 'object') return data

    for (const [urlKey, idKey] of BUNNY_PAIRS) {
        if (data[idKey]) {
            data[urlKey] = bunnyMp4Url(data[idKey]) || data[urlKey]
        }
    }
    for (const key of Object.keys(data)) {
        data[key] = resolveBunnyVideos(data[key])
    }
    return data
}

async function fetchResolved(query, params = {}) {
    return resolveBunnyVideos(await client.fetch(query, params, options))
}

export async function fetchHero() {
    return fetchResolved(HERO_QUERY)
}

export async function fetchLayout() {
    return fetchResolved(LAYOUT_QUERY)
}

export async function fetchProjects() {
    return fetchResolved(PROJECTS_QUERY)
}

export async function fetchProjectBySlug(slug) {
    return fetchResolved(PROJECT_BY_SLUG_QUERY, { slug })
}

export async function fetchFeaturedProjects() {
    return fetchResolved(FEATURED_QUERY)
}

export async function fetchMission() {
    return fetchResolved(MISSION_QUERY)
}

export async function fetchSpecialProjects() {
    return fetchResolved(SPECIAL_PROJECTS_QUERY)
}

export async function fetchSpecialProjectPages() {
    return fetchResolved(SPECIAL_PROJECT_PAGES_QUERY)
}

export async function fetchSpecialProjectPageBySlug(slug) {
    return fetchResolved(SPECIAL_PROJECT_PAGE_BY_SLUG_QUERY, { slug })
}

export async function fetchSpecialProjectPageSlugs() {
    return fetchResolved(SPECIAL_PROJECT_PAGE_SLUGS_QUERY)
}

export async function fetchSpecialProjectPageNav() {
    return fetchResolved(SPECIAL_PROJECT_PAGE_NAV_QUERY)
}

export async function fetchSpecialProjectsLanding() {
    return fetchResolved(SPECIAL_PROJECTS_LANDING_QUERY)
}

export async function fetchAbout() {
    return fetchResolved(ABOUT_QUERY)
}

export async function fetchInquire() {
    return fetchResolved(INQUIRE_QUERY)
}

export async function fetchInquireOnly() {
    return fetchResolved(INQUIRE_ONLY_QUERY)
}

export async function fetchContactCta() {
    return fetchResolved(CONTACT_CTA_QUERY)
}

export async function fetchProjectNav() {
    return fetchResolved(PROJECT_NAV_QUERY)
}

export async function fetchProjectSlugs() {
    return fetchResolved(PROJECT_SLUGS_QUERY)
}
