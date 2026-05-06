import { defineField, defineType } from "sanity"

export default defineType({
    name: "clientsAndPress",
    title: "Clients & Press",
    type: "document",
    groups: [
        { name: "clients", title: "Clients", default: true },
        { name: "press", title: "Press" },
    ],
    fields: [
        defineField({
            name: "title",
            title: "Clients Title",
            type: "string",
            group: "clients",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "clients",
            title: "Clients",
            type: "array",
            of: [{ type: "block" }],
            group: "clients",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "pressTitle",
            title: "Press Title",
            type: "string",
            group: "press",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "press",
            title: "Press",
            type: "array",
            of: [{ type: "block" }],
            group: "press",
            validation: Rule => Rule.required(),
        }),
    ],
    preview: { select: { title: "title" } },
})
