import { ColorWheelIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

export default defineType({
    name: "mission",
    title: "Mission",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
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
            name: "missionCards",
            title: "Mission Cards",
            type: "array",
            of: [{ type: "missionCard" }],
            validation: Rule => Rule.required().max(3),
        }),
    ],
    preview: { select: { title: "title" } },
})
