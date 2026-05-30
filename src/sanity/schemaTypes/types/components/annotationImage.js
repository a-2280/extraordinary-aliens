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
            validation: Rule => Rule.custom((image, context) =>
                image || context.parent?.video ? true : "Add an image or a video"
            ),
        },
        {
            name: "video",
            title: "Video (optional, plays over image)",
            type: "file",
            options: { accept: "video/*" },
        },
        {
            name: "bunnyVideoId",
            title: "Bunny video ID (for large videos)",
            type: "string",
            description: "Paste the video's ID from the Bunny Stream library. Takes priority over an uploaded file.",
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
                    { title: "Portrait", value: "normal" },
                    { title: "Landscape", value: "cut" },
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
