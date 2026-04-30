import { ColorWheelIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

export default defineType({
    name: "contactCta",
    title: "Contact CTA",
    type: "document",
    fields: [
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
            name: "button",
            title: "CTA Button",
            type: "string",
            validation: Rule => Rule.required(),
        }),
    ],
    preview: { select: { title: "title" } },
})
