import { BlockElementIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

export default defineType({
    name: "footer",
    title: "Footer",
    icon: BlockElementIcon,
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            description: "Only used internally in the CMS",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "caption",
            title: "Caption",
            type: "array",
            of: [{ type: "block" }],
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "details",
            title: "Details",
            type: "footerDetails",
        }),
        defineField({
            name: "copyright",
            title: "Copyright",
            type: "string",
            validation: Rule => Rule.required(),
        }),
    ],
    preview: {
        select: {
            title: "title",
        },
    },
})
