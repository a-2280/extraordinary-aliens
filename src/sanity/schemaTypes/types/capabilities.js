import { defineField, defineType } from "sanity"

export default defineType({
    name: "capabilities",
    title: "Capabilities",
    type: "document",
    groups: [
        { name: "capabilities", title: "Capabilities", default: true },
        { name: "industries", title: "Industries" },
    ],
    fields: [
        defineField({
            name: "title",
            title: "Capabilities Title",
            type: "string",
            group: "capabilities",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "capabilities",
            title: "Capabilities",
            type: "array",
            of: [{ type: "reference", to: [{ type: "tag" }] }],
            group: "capabilities",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "industriesTitle",
            title: "Industries Title",
            type: "string",
            group: "industries",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "industries",
            title: "Industries",
            type: "array",
            of: [{ type: "reference", to: [{ type: "name" }] }],
            group: "industries",
            validation: Rule => Rule.required(),
        }),
    ],
    preview: { select: { title: "title" } },
})
