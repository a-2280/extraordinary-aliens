import { ComponentIcon } from "@sanity/icons"

export default {
    name: "aboutComponentList",
    title: "Components",
    icon: ComponentIcon,
    type: "array",
    of: [
        { type: "studio" },
        { type: "approach" },
        { type: "capabilities" },
        { type: "clientsAndPress" },
    ],
    validation: Rule => Rule.custom(items => {
        if (!items) return true
        const seen = new Set()
        const dupes = []
        for (const item of items) {
            if (seen.has(item._type)) dupes.push(item._type)
            else seen.add(item._type)
        }
        return dupes.length ? `Each section can only be added once. Duplicates: ${[...new Set(dupes)].join(", ")}` : true
    }),
}
