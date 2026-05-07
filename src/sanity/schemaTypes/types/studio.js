import { defineField, defineType } from "sanity"

export default defineType({
    name: "studio",
    title: "Studio",
    type: "document",
    groups: [
        { name: "founder", title: "Founder and Creative Director", default: true },
        { name: "about", title: "About" },
        { name: "collaborators", title: "Collaborators" },
    ],
    fields: [
        defineField({
            name: "title",
            title: "Founder and Creative Director Title",
            type: "string",
            group: "founder",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "founderAndDirector",
            title: "Founder and Creative Director",
            type: "array",
            of: [{ type: "name" }],
            group: "founder",
            validation: Rule => Rule.required().max(2),
        }),
        defineField({
            name: "aboutTitle",
            title: "About Title",
            type: "string",
            group: "about",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "about",
            title: "About",
            type: "text",
            group: "about",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "collaboratorsTitle",
            title: "Collaborators Title",
            type: "string",
            group: "collaborators",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "collaborators",
            title: "Collaborators",
            type: "array",
            group: "collaborators",
            of: [{ type: 'name' }],
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "showCollaborators",
            title: "Show Collaborators (replaces About on the live site)",
            type: "boolean",
            group: "collaborators",
            initialValue: false,
        }),
    ],
    preview: { select: { title: "title" } },
})
