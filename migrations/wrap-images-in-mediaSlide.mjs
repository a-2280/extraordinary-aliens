// One-time migration: wrap entries in `images[]` arrays with the mediaSlide object.
//
// Affected fields:
//   - projects.images[]
//   - specialProjectsPage.images[]
//   - carousel.images[]  (nested in caseStudySections[].left/right/items[])
//
// Each entry { _type: 'image', _key, asset } becomes
//   { _type: 'mediaSlide', _key, image: { _type: 'image', asset } }
//
// Run with:
//   NEXT_PUBLIC_SANITY_PROJECT_ID=xxx \
//   NEXT_PUBLIC_SANITY_DATASET=production \
//   SANITY_AUTH_TOKEN=$(npx sanity exec --help >/dev/null 2>&1; cat ~/.sanity/config.json | jq -r .authToken) \
//   node migrations/wrap-images-in-mediaSlide.mjs --dry-run
//
// Drop --dry-run to actually patch documents.

import { createClient } from "@sanity/client"
import { randomUUID } from "node:crypto"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_AUTH_TOKEN

if (!projectId || !dataset || !token) {
    console.error("Missing env: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_AUTH_TOKEN")
    process.exit(1)
}

const dryRun = process.argv.includes("--dry-run")

const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2026-04-21",
    useCdn: false,
})

const isUnwrappedImage = entry =>
    entry && entry._type === "image" && entry.asset && !entry.image

const wrap = entry => ({
    _type: "mediaSlide",
    _key: entry._key || randomUUID(),
    image: { _type: "image", asset: entry.asset, ...(entry.hotspot ? { hotspot: entry.hotspot } : {}), ...(entry.crop ? { crop: entry.crop } : {}) },
})

const transformImagesArray = arr => {
    if (!Array.isArray(arr)) return { changed: false, value: arr }
    let changed = false
    const next = arr.map(entry => {
        if (isUnwrappedImage(entry)) {
            changed = true
            return wrap(entry)
        }
        return entry
    })
    return { changed, value: next }
}

const transformSection = section => {
    if (!section || typeof section !== "object") return { changed: false, value: section }
    let changed = false
    const next = { ...section }

    if (section._type === "carousel") {
        const result = transformImagesArray(section.images)
        if (result.changed) {
            changed = true
            next.images = result.value
        }
    }

    for (const childKey of ["left", "right", "items"]) {
        if (Array.isArray(section[childKey])) {
            let childChanged = false
            const newChildren = section[childKey].map(child => {
                const r = transformSection(child)
                if (r.changed) childChanged = true
                return r.value
            })
            if (childChanged) {
                changed = true
                next[childKey] = newChildren
            }
        }
    }

    return { changed, value: next }
}

const migrateDoc = async doc => {
    let changed = false
    const patch = {}

    if (Array.isArray(doc.images)) {
        const r = transformImagesArray(doc.images)
        if (r.changed) {
            changed = true
            patch.images = r.value
        }
    }

    if (Array.isArray(doc.caseStudySections)) {
        let sectionsChanged = false
        const newSections = doc.caseStudySections.map(s => {
            const r = transformSection(s)
            if (r.changed) sectionsChanged = true
            return r.value
        })
        if (sectionsChanged) {
            changed = true
            patch.caseStudySections = newSections
        }
    }

    if (!changed) return { id: doc._id, skipped: true }

    if (dryRun) {
        return { id: doc._id, dryRun: true, fields: Object.keys(patch) }
    }

    await client.patch(doc._id).set(patch).commit({ autoGenerateArrayKeys: true })
    return { id: doc._id, patched: Object.keys(patch) }
}

const run = async () => {
    const docs = await client.fetch(
        `*[_type in ["projects", "specialProjectsPage"]]`,
    )
    console.log(`Found ${docs.length} documents (projects + specialProjectsPage)`)
    if (dryRun) console.log("DRY RUN — no writes will be made")

    const results = []
    for (const doc of docs) {
        try {
            const r = await migrateDoc(doc)
            results.push(r)
            console.log(JSON.stringify(r))
        } catch (err) {
            console.error(`Failed ${doc._id}:`, err.message)
            results.push({ id: doc._id, error: err.message })
        }
    }

    const patched = results.filter(r => r.patched).length
    const wouldPatch = results.filter(r => r.dryRun).length
    const skipped = results.filter(r => r.skipped).length
    const failed = results.filter(r => r.error).length
    console.log(`\nDone. patched=${patched} wouldPatch=${wouldPatch} skipped=${skipped} failed=${failed}`)
}

run().catch(err => {
    console.error(err)
    process.exit(1)
})
