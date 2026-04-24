import {defineField, defineType} from 'sanity'

export default defineType({
    name: "layout",
    title: "Layout",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "homepage",
            title: "Homepage",
            description: "Select the page you want to be the homepage.",
            type: "reference",
            to: [{ type: "page" }],
            validation: Rule => Rule.required(),
        }),
        // defineField({
        //     name: "notFoundPage",
        //     title: "Not Found Page",
        //     description: "Select the page you want to be the 404/500 error page.",
        //     type: "reference",
        //     to: [{ type: "notFound" }],
        //     validation: Rule => Rule.required(),
        // }),
        defineField({
            name: "header",
            title: "Header",
            type: "reference",
            to: [{ type: "header" }],
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "footer",
            title: "Footer",
            type: "reference",
            to: [{ type: "footer" }],
            validation: Rule => Rule.required(),
        }),
    ],
    preview: { select: { title: "title" } },
})
