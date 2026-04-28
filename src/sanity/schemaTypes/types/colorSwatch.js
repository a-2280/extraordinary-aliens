import React from "react"
import { defineField, defineType } from "sanity"

export default defineType({
    name: "colorSwatch",
    title: "Color Swatch",
    type: "document",
    fields: [
        defineField({
            name: "label",
            title: "Label",
            type: "string",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "color",
            title: "Color",
            type: "color",
            options: { disableAlpha: true },
            validation: Rule => Rule.required(),
        }),
    ],
    preview: {
        select: {
            title: "label",
            color: "color",
        },
        prepare({ title, color }) {
            return {
                title,
                media: color?.hex
                    ? () =>
                          React.createElement("div", {
                              style: {
                                  background: color.hex,
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: 2,
                              },
                          })
                    : undefined,
            }
        },
    },
})
