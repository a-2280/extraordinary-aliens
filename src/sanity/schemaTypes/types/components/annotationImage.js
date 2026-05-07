import { ImageIcon } from "@sanity/icons"

export default {
    name: "annotationImage",
    title: "Annotation Image",
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
            name: "video",
            title: "Video (optional, plays over image)",
            type: "file",
            options: { accept: "video/*" },
        },
        {
            name: "title",
            title: "Title",
            type: "string",
            validation: Rule => Rule.required(),
        },
        {
            name: "annotation",
            title: "Annotation",
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
