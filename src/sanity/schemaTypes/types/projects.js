import { defineField, defineType } from "sanity"
import { orderRankField } from "@sanity/orderable-document-list"

export default defineType({
    name: "projects",
    title: "Projects",
    type: "document",
    fields: [
        orderRankField({ type: "projects" }),
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "title" },
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "array",
            of: [{ type: "block" }],
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "tags",
            title: "Tags",
            type: "array",
            of: [{ type: "reference", to: [{ type: "tag" }] }],
        }),
        defineField({
            name: "images",
            title: "Images",
            type: "array",
            of: [{ type: "image" }],
        }),
        defineField({
            name: "featured",
            title: "Featured",
            type: "boolean",
        }),
    ],
    preview: { select: { title: "title" } },
})