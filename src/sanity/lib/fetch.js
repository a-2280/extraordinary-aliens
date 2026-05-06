import { client } from "./client"
import { LAYOUT_QUERY, HERO_QUERY, PROJECTS_QUERY, PROJECT_SLUGS_QUERY, PROJECT_NAV_QUERY, PROJECT_BY_SLUG_QUERY, FEATURED_QUERY, MISSION_QUERY, SPECIAL_PROJECTS_QUERY, SPECIAL_PROJECT_PAGES_QUERY, SPECIAL_PROJECT_PAGE_SLUGS_QUERY, SPECIAL_PROJECT_PAGE_NAV_QUERY, SPECIAL_PROJECT_PAGE_BY_SLUG_QUERY, SPECIAL_PROJECTS_LANDING_QUERY, ABOUT_QUERY, CONTACT_CTA_QUERY } from "./queries"

export async function fetchLayout() {
    return client.fetch(LAYOUT_QUERY)
}

export async function fetchHero() {
    return client.fetch(HERO_QUERY)
}

export async function fetchProjects() {
    return client.fetch(PROJECTS_QUERY)
}

export async function fetchProjectSlugs() {
    return client.fetch(PROJECT_SLUGS_QUERY)
}

export async function fetchProjectNav() {
    return client.fetch(PROJECT_NAV_QUERY)
}

export async function fetchProjectBySlug(slug) {
    return client.fetch(PROJECT_BY_SLUG_QUERY, { slug })
}

export async function fetchFeaturedProjects() {
    return client.fetch(FEATURED_QUERY)
}

export async function fetchMission() {
    return client.fetch(MISSION_QUERY)
}

export async function fetchSpecialProjects() {
    return client.fetch(SPECIAL_PROJECTS_QUERY)
}

export async function fetchSpecialProjectPages() {
    return client.fetch(SPECIAL_PROJECT_PAGES_QUERY)
}

export async function fetchSpecialProjectPageSlugs() {
    return client.fetch(SPECIAL_PROJECT_PAGE_SLUGS_QUERY)
}

export async function fetchSpecialProjectPageNav() {
    return client.fetch(SPECIAL_PROJECT_PAGE_NAV_QUERY)
}

export async function fetchSpecialProjectPageBySlug(slug) {
    return client.fetch(SPECIAL_PROJECT_PAGE_BY_SLUG_QUERY, { slug })
}

export async function fetchSpecialProjectsLanding() {
    return client.fetch(SPECIAL_PROJECTS_LANDING_QUERY)
}

export async function fetchAbout() {
    return client.fetch(ABOUT_QUERY)
}

export async function fetchContactCta() {
    return client.fetch(CONTACT_CTA_QUERY)
}