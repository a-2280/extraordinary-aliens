import { defineField, defineType } from "sanity"

export default defineType({
    name: "specialProjectsSettings",
    title: "Special Projects Landing",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Name",
            description: "Label for internal use.",
            type: "string",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "title",
            title: "Hero Title",
            type: "string",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
        }),
        defineField({
            name: "featured",
            title: "Featured Project",
            type: "reference",
            to: [{ type: "specialProjectsPage" }],
        }),
    ],
    preview: {
        select: { title: "name", featured: "featured.title" },
        prepare({ title, featured }) {
            return {
                title,
                subtitle: featured ? `Featured: ${featured}` : "No featured project",
            }
        },
    },
})
