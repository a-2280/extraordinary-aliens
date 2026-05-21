import { ColorWheelIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

export default defineType({
    name: "inquire",
    title: "Inquire",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Name",
            description: "Label for internal use.",
            type: "string",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "inquireOnly",
            title: "Inquire Only Mode",
            description: "When on, the rest of the site redirects to /inquire.",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "array",
            of: [
                {
                    type: "block",
                    marks: {
                        annotations: [
                            {
                                name: "textColor",
                                title: "Text Color",
                                type: "object",
                                icon: ColorWheelIcon,
                                fields: [
                                    {
                                        name: "swatch",
                                        title: "Color",
                                        type: "reference",
                                        to: [{ type: "colorSwatch" }],
                                    },
                                ],
                            },
                        ],
                    },
                },
            ],
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "formText",
            title: "Form Text",
            type: "array",
            of: [
                {
                    type: "block",
                    marks: {
                        annotations: [
                            {
                                name: "textColor",
                                title: "Text Color",
                                type: "object",
                                icon: ColorWheelIcon,
                                fields: [
                                    {
                                        name: "swatch",
                                        title: "Color",
                                        type: "reference",
                                        to: [{ type: "colorSwatch" }],
                                    },
                                ],
                            },
                        ],
                    },
                },
            ],
        }),
        defineField({
            name: "buttons",
            title: "Buttons",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        { name: "title", title: "Title", type: "string", validation: Rule => Rule.required() },
                        { name: "link", title: "Link", type: "string" },
                    ],
                    preview: { select: { title: "title" } },
                },
            ],
        }),
        defineField({
            name: "footerImage",
            title: "Footer Image",
            type: "image",
        }),
        defineField({
            name: "footerVideo",
            title: "Footer Video (optional, plays over footer image)",
            type: "file",
            options: { accept: "video/*" },
        }),
        defineField({
            name: "location",
            title: "Location",
            type: "string",
        }),
        defineField({
            name: "locationImage",
            title: "Location Hover Image",
            type: "image",
        }),
        defineField({
            name: "locationVideo",
            title: "Location Hover Video",
            type: "file",
            options: { accept: "video/*" },
        }),
        defineField({
            name: "copyright",
            title: "Copyright",
            type: "string",
        }),
    ],
    preview: { select: { title: "name" } },
})
