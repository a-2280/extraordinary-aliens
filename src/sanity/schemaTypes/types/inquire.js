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
                        { name: "image", title: "Image", type: "image" },
                        { name: "video", title: "Video (optional, plays over image)", type: "file", options: { accept: "video/*" } },
                    ],
                    preview: { select: { title: "title", media: "image" } },
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
            name: "copyright",
            title: "Copyright",
            type: "string",
        }),
    ],
    preview: { select: { title: "name" } },
})
