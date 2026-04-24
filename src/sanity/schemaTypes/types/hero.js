import { defineField, defineType } from "sanity";

export default defineType({
    name: "hero",
    title: "Hero",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: Rule => Rule.required(),
        })
    ],
    preview: { select: { title: "title" } },
})
