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
        defineField({
            name: "aboutPage",
            title: "About Page",
            description: "Select the About variant you want to render at /about.",
            type: "reference",
            to: [{ type: "about" }],
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "specialProjectsLanding",
            title: "Special Projects Landing",
            description: "Select the Special Projects Landing variant you want to render at /special-projects.",
            type: "reference",
            to: [{ type: "specialProjectsSettings" }],
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
