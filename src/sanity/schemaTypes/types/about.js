import { ColorWheelIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

export default defineType({
    name: "about",
    title: "About",
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
            name: "title",
            title: "Title",
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
            type: "aboutComponentList",
            name: "components",
            title: "Components",
        }),
        defineField({
            name: "image",
            title: "image",
            type: 'image',
        }),
        defineField({
            name: "video",
            title: "Video (optional, plays over image)",
            type: "file",
            options: { accept: "video/*" },
        }),
        defineField({
            name: "bunnyVideoId",
            title: "Bunny video ID (for large videos)",
            type: "string",
            description: "Paste the video's ID from the Bunny Stream library. Takes priority over an uploaded file.",
        }),
    ],
    preview: { select: { title: "name" } },
})
