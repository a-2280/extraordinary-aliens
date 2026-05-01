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
    name: "imageComponent",
    title: "Image",
    icon: ImageIcon,
    type: "object",
    fields: [
        {
            name: "image",
            title: "Image",
            type: "image",
            options: { hotspot: true },
            validation: Rule => Rule.required(),
        },
        {
            name: "alt",
            title: "Alt Text",
            type: "string",
            description: "Alt text for accessibility. Leave empty only if the image is decorative.",
            validation: Rule => Rule.required(),
        },
        {
            name: "variant",
            title: "Variant",
            type: "string",
            options: {
                list: [
                    { title: "100vw (full bleed)", value: "100vw" },
                    { title: "Normal", value: "normal" },
                    { title: "Cut", value: "cut" },
                ],
                layout: "radio",
            },
            initialValue: "normal",
            validation: Rule => Rule.required(),
        },
        {
            name: "caption",
            title: "Caption",
            type: "string",
            description: "Optional short caption rendered under the image.",
        },
    ],
    preview: {
        select: {
            media: "image",
            alt: "alt",
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
