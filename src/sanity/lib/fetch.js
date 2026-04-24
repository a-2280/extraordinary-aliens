import { client } from './client'
import { LAYOUT_QUERY } from './queries'

export async function fetchLayout() {
    return client.fetch(LAYOUT_QUERY)
}
