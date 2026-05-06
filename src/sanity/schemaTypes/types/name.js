import { defineField, defineType } from "sanity"

export default defineType({
    name: "name",
    title: "Name",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Name",
            type: "string",
            validation: Rule => Rule.required(),
        }),
    ],
    preview: { select: { title: "name" } },
})
