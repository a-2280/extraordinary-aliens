import { client } from "./client"
import { LAYOUT_QUERY, HERO_QUERY, PROJECTS_QUERY, FEATURED_QUERY, MISSION_QUERY, SPECIAL_PROJECTS_QUERY, CONTACT_CTA_QUERY } from "./queries"

export async function fetchLayout() {
    return client.fetch(LAYOUT_QUERY)
}

export async function fetchHero() {
    return client.fetch(HERO_QUERY)
}

export async function fetchProjects() {
    return client.fetch(PROJECTS_QUERY)
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

export async function fetchContactCta() {
    return client.fetch(CONTACT_CTA_QUERY)
}