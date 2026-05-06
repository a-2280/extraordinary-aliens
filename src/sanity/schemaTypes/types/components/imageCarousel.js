// TEMPLATE: section component object type.
// To add a new component (e.g. carouselComponent, textComponent, annotationImageCardComponent):
//   1. Copy this file to ../components/<newName>Component.js
//   2. Rename the schema `name` to `<newName>Component` (suffix avoids collisions
//      with built-ins like `image`, `text`).
//   3. Replace the fields below with the new component's fields. Keep `variant`
//      as a per-component string enum if the component has visual variants.
//   4. Update preview.select / prepare to reflect the new fields.
//   5. Register the new schema in src/sanity/schemaTypes/index.js
//      (import + push into schema.types).
//   6. Add { type: "<newName>Component" } to `sectionComponents` in
//      src/sanity/schemaTypes/types/section.js.

import { ImageIcon } from "@sanity/icons"

export default {
    name: "imageCard",
    title: "Image",
    icon: ImageIcon,
    type: "object",
    fields: [
        {
            name: "image",
            title: "Image",
            type: "image",
            validation: Rule => Rule.required(),
        },
        {
            name: "description",
            title: "Description",
            type: "text",
        },
        {
            name: "variant",
            title: "Variant",
            type: "string",
            options: {
                list: [
                    { title: "Full Width", value: "fullWidth" },
                    { title: "Normal", value: "normal" },
                    { title: "Cut", value: "cut" },
                ],
                layout: "radio",
            },
            initialValue: "normal",
            validation: Rule => Rule.required(),
        },
    ],
    preview: {
        select: {
            media: "image",
            variant: "variant",
        },
        prepare({ media, alt, variant }) {
            return {
                title: alt || "Image",
                subtitle: `Image — ${variant || "normal"}`,
                media,
            }
        },
    },
}
