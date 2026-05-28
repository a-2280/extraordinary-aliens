import { defineField, defineType } from "sanity"
import { orderRankField } from "@sanity/orderable-document-list"
import { makeBackButtonItem } from "../../components/BackButtonItem"

export default defineType({
    name: "specialProjectsPage",
    title: "Special Projects Page",
    type: "document",
    fieldsets: [
        { name: "listing", title: "Listing card", options: { collapsible: true } },
        { name: "caseStudy", title: "Case study page", options: { collapsible: true } },
    ],
    fields: [
        orderRankField({ type: "specialProjectsPage" }),
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
            name: "images",
            title: "Images",
            type: "array",
            of: [{ type: "mediaSlide" }],
            fieldset: "listing",
        }),
        defineField({
            name: "tags",
            title: "Tags",
            type: "array",
            of: [{ type: "reference", to: [{ type: "tag" }] }],
            fieldset: "caseStudy",
        }),
        defineField({
            name: "heroImage",
            title: "Hero Image",
            type: "image",
            fieldset: "caseStudy",
            validation: Rule => Rule.custom((heroImage, context) =>
                heroImage || context.parent?.heroVideo ? true : "Add a hero image or hero video"
            ),
        }),
        defineField({
            name: "heroVideo",
            title: "Hero Video (optional, plays over hero image)",
            type: "file",
            options: { accept: "video/*" },
            fieldset: "caseStudy",
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
                { type: "imageTrio", components: { item: makeBackButtonItem("Case Study") } },
                { type: "sectionGroup", components: { item: makeBackButtonItem("Case Study") } },
            ],
            fieldset: "caseStudy",
            validation: Rule => Rule.max(50),
        }),
    ],
    preview: { select: { title: "title" } },
})
