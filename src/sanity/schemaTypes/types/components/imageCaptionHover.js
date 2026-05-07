import { TextIcon } from "@sanity/icons"

export default {
    name: "imageCaptionHover",
    title: "Image with hover caption",
    icon: TextIcon,
    type: "object",
    fields: [
        {
            name: "image",
            title: "Image",
            type: "image",
            validation: Rule => Rule.required(),
        },
        {
            name: "video",
            title: "Video (optional, plays over image)",
            type: "file",
            options: { accept: "video/*" },
        },
        {
            name: "caption",
            title: "Caption",
            type: "array",
            of: [{ type: "block" }],
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
            media: "image",
            caption: "caption",
            variant: "variant",
        },
        prepare({ media, caption, variant }) {
            const text = caption?.[0]?.children?.[0]?.text || "Image"
            return {
                title: text,
                subtitle: `Image — ${variant || "normal"}`,
                media,
            }
        },
    },
}
