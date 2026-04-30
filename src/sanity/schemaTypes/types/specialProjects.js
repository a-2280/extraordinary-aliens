import { defineField, defineType } from "sanity"

export default defineType({
    name: "specialProjects",
    title: "Special Projects",
    type: "document",
    fields: [
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
        defineField({
            name: "url",
            title: "URL",
            type: "url",
            validation: Rule =>
                Rule.required().uri({
                    allowRelative: true,
                    scheme: ["http", "https", "tel", "sms", "mailto"],
                }),
        }),
        defineField({
            name: "image",
            title: "Image",
            type: "image",
            validation: Rule => Rule.required(),
        }),
    ],
    preview: { select: { title: "title" } },
})
