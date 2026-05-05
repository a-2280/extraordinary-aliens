import { defineField, defineType } from "sanity"

export default defineType({
    name: "specialProjectsSettings",
    title: "Special Projects Settings",
    type: "document",
    fields: [
        defineField({
            name: "featured",
            title: "Featured Project",
            type: "reference",
            to: [{ type: "specialProjectsPage" }],
        }),
    ],
    preview: {
        select: { title: "featured.title" },
        prepare({ title }) {
            return {
                title: "Special Projects Settings",
                subtitle: title ? `Featured: ${title}` : "No featured project",
            }
        },
    },
})
