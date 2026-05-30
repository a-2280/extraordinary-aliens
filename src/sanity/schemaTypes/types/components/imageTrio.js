import { ImagesIcon } from "@sanity/icons"
import { makeBackButtonItem } from "../../../components/BackButtonItem"

export default {
    name: "imageTrio",
    title: "Three Images",
    icon: ImagesIcon,
    type: "object",
    fields: [
        {
            name: "items",
            title: "Images",
            type: "array",
            of: [
                {
                    type: "object",
                    name: "trioItem",
                    components: { item: makeBackButtonItem("Three Images") },
                    fields: [
                        { name: "image", title: "Image", type: "image", validation: Rule => Rule.custom((image, context) => image || context.parent?.video ? true : "Add an image or a video") },
                        { name: "video", title: "Video (optional, plays over image)", type: "file", options: { accept: "video/*" } },
                        { name: "bunnyVideoId", title: "Bunny video ID (for large videos)", type: "string", description: "Paste the video's ID from the Bunny Stream library. Takes priority over an uploaded file." },
                    ],
                    preview: { select: { media: "image" } },
                },
            ],
            validation: Rule => Rule.required().min(3).max(3),
        },
        {
            name: "aspect",
            title: "Aspect Ratio",
            type: "string",
            options: {
                list: [
                    { title: "Portrait (3:4)", value: "portrait" },
                    { title: "Landscape (16:10)", value: "landscape" },
                ],
                layout: "radio",
            },
            initialValue: "portrait",
            validation: Rule => Rule.required(),
        },
        {
            name: "variant",
            title: "Variant",
            type: "string",
            hidden: true,
            initialValue: "fullWidth",
        },
    ],
    preview: {
        select: { media: "items.0.image", aspect: "aspect" },
        prepare({ media, aspect }) {
            return {
                title: "Three Images",
                subtitle: `Three Images — ${aspect || "portrait"}`,
                media,
            }
        },
    },
}
