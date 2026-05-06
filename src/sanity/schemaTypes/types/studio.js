import { defineField, defineType } from "sanity"

export default defineType({
    name: "studio",
    title: "Studio",
    type: "document",
    groups: [
        { name: "founder", title: "Founder and Creative Director", default: true },
        { name: "about", title: "About" },
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
    ],
    preview: { select: { title: "title" } },
})
