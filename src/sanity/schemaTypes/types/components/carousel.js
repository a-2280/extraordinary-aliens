import { ImageIcon } from "@sanity/icons"

export default {
    name: "carousel",
    title: "Image Carousel",
    icon: ImageIcon,
    type: "object",
    fields: [
        {
            name: "images",
            title: "Images",
            type: "array",
            of: [{ type: "image" }],
            validation: Rule => Rule.required(),
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
            media: "images.0",
            variant: "variant",
        },
        prepare({ media, variant }) {
            return {
                title: "Carousel",
                subtitle: `Carousel — ${variant || "normal"}`,
                media,
            }
        },
    },
}
