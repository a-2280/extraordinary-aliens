import { ColorWheelIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
    name: "hero",
    title: "Hero",
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
            type: "link",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "videoModal",
            title: "Video Modal (optional)",
            description: "When set, the CTA opens a video lightbox instead of navigating to the URL.",
            type: "videoModal",
        }),
    ],
    preview: { prepare: () => ({ title: "Hero" }) },
})
