import { defineField, defineType } from "sanity"

export default defineType({
    name: "approach",
    title: "Approach",
    type: "document",
    fields: [
        defineField({
            name: "items",
            title: "Items",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        defineField({
                            name: "image",
                            title: "Image",
                            type: "image",
                            validation: Rule => Rule.required(),
                        }),
                        defineField({
                            name: "title",
                            title: "Title",
                            type: "string",
                            validation: Rule => Rule.required(),
                        }),
                        defineField({
                            name: "description",
                            title: "Description",
                            type: "text",
                            validation: Rule => Rule.required(),
                        }),
                    ],
                    preview: {
                        select: { title: "title", media: "image" },
                    },
                },
            ],
            validation: Rule => Rule.required().min(1),
        }),
    ],
    preview: {
        select: { items: "items" },
        prepare({ items }) {
            return { title: "Approach", subtitle: `${items?.length ?? 0} item${items?.length === 1 ? "" : "s"}` }
        },
    },
})
