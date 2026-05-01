import { defineField, defineType } from "sanity"
import { orderRankField } from "@sanity/orderable-document-list"
import { sectionComponents } from "./section"

export default defineType({
    name: "projects",
    title: "Projects",
    type: "document",
    fieldsets: [
        { name: "listing", title: "Listing card", options: { collapsible: true, collapsed: false } },
        { name: "caseStudy", title: "Case study page", options: { collapsible: true, collapsed: false } },
    ],
    fields: [
        orderRankField({ type: "projects" }),
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
            name: "featured",
            title: "Featured",
            type: "boolean",
            fieldset: "listing",
        }),
        defineField({
            name: "caseStudyClient",
            title: "Client",
            type: "string",
            description: "Optional eyebrow / client credit shown above the title on the case study page.",
            fieldset: "caseStudy",
        }),
        defineField({
            name: "caseStudyHeroImage",
            title: "Hero Image",
            type: "image",
            options: { hotspot: true },
            fieldset: "caseStudy",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "caseStudyHeroAlt",
            title: "Hero Alt Text",
            type: "string",
            fieldset: "caseStudy",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "caseStudyIntro",
            title: "Intro",
            type: "array",
            of: [{ type: "block" }],
            description: "Long intro / overview shown in the case study header (separate from the listing description).",
            fieldset: "caseStudy",
            validation: Rule => Rule.required().min(1),
        }),
        defineField({
            name: "caseStudySections",
            title: "Case Study Sections",
            type: "array",
            of: [...sectionComponents, { type: "section" }],
            fieldset: "caseStudy",
            validation: Rule => Rule.max(50),
        }),
    ],
    preview: { select: { title: "title" } },
})
