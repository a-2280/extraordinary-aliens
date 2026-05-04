import { defineField, defineType } from "sanity"
import { orderRankField } from "@sanity/orderable-document-list"
import { makeBackButtonItem } from "../../components/BackButtonItem"

export default defineType({
    name: "projects",
    title: "Projects",
    type: "document",
    fieldsets: [
        { name: "listing", title: "Listing card", options: { collapsible: true } },
        { name: "caseStudy", title: "Case study page", options: { collapsible: true } },
    ],
    fields: [
        orderRankField({ type: "projects" }),
        defineField({
            name: "featured",
            title: "Featured",
            type: "boolean",
        }),
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            fieldset: "listing",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "title" },
            fieldset: "listing",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "array",
            of: [{ type: "block" }],
            fieldset: "listing",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "tags",
            title: "Tags",
            type: "array",
            of: [{ type: "reference", to: [{ type: "tag" }] }],
            fieldset: "listing",
        }),
        defineField({
            name: "images",
            title: "Images",
            type: "array",
            of: [{ type: "image" }],
            fieldset: "listing",
        }),
        defineField({
            name: "heroImage",
            title: "Hero Image",
            type: "image",
            fieldset: "caseStudy",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "client",
            title: "Client",
            type: "string",
            fieldset: "caseStudy",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "liveWebsite",
            title: "Live Website",
            type: "link",
            fieldset: "caseStudy",
        }),
        defineField({
            name: "caseStudyIntro",
            title: "Introduction",
            type: "array",
            of: [{ type: "block" }],
            fieldset: "caseStudy",
        }),
        defineField({
            name: "year",
            title: "Year",
            type: "string",
            fieldset: "caseStudy",
        }),
        defineField({
            name: "caseStudySections",
            title: "Case Study Sections",
            type: "array",
            of: [
                { type: "section", components: { item: makeBackButtonItem("Case Study") } },
                { type: "textLarge", components: { item: makeBackButtonItem("Case Study") } },
                { type: "quote", components: { item: makeBackButtonItem("Case Study") } },
                { type: "list", components: { item: makeBackButtonItem("Case Study") } },
                { type: "credits", components: { item: makeBackButtonItem("Case Study") } },
            ],
            fieldset: "caseStudy",
            validation: Rule => Rule.max(50),
        }),
    ],
    preview: { select: { title: "title" } },
})
