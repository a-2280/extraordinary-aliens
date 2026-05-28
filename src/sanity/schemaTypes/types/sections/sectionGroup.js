import { StackIcon } from "@sanity/icons"
import { makeBackButtonItem } from "../../../components/BackButtonItem"

const childTypes = ["section", "textLarge", "quote", "list", "credits", "imageTrio"]

const itemsOf = childTypes.map(type => ({
    type,
    components: { item: makeBackButtonItem("Section group") },
}))

export default {
    name: "sectionGroup",
    title: "Section group",
    icon: StackIcon,
    type: "object",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
            validation: Rule => Rule.required(),
        },
        {
            name: "slug",
            title: "Anchor id",
            type: "slug",
            options: {
                source: (_doc, { parent }) => parent?.title,
            },
            validation: Rule => Rule.required(),
        },
        {
            name: "items",
            title: "Items",
            type: "array",
            of: itemsOf,
            validation: Rule => Rule.min(1).max(50),
        },
    ],
    preview: {
        select: {
            title: "title",
            items: "items",
        },
        prepare({ title, items }) {
            const count = items?.length || 0
            return {
                title: title || "Section group",
                subtitle: `${count} item${count === 1 ? "" : "s"}`,
            }
        },
    },
}
