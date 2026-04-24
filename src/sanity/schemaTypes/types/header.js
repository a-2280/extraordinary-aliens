import { BlockElementIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

export default defineType({
    name: "header",
    title: "Header",
    icon: BlockElementIcon,
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "links",
            title: "Links",
            type: "ctaList",
        }),
    ],
    preview: {
        select: {
            title: "title",
        },
    },
})
