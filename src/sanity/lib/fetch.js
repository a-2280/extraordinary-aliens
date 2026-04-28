import { client } from './client'
import { LAYOUT_QUERY, HERO_QUERY } from './queries'

export async function fetchLayout() {
    return client.fetch(LAYOUT_QUERY)
}

export async function fetchHero() {
    return client.fetch(HERO_QUERY)
}
