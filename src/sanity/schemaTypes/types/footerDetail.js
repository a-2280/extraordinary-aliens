import { LinkIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

export default defineType({
    name: "footerDetail",
    title: "Footer Detail",
    icon: LinkIcon,
    type: "object",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "detail",
            title: "Detail",
            type: "array",
            of: [{ type: "block" }],
            validation: Rule => Rule.required(),
        }),
    ],
    preview: {
        select: {
            title: "title",
        },
    },
})
