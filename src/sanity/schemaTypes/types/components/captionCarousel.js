import { ImageIcon } from "@sanity/icons"
import { makeBackButtonItem } from "../../../components/BackButtonItem"

export default {
    name: "captionCarousel",
    title: "Caption Carousel",
    icon: ImageIcon,
    type: "object",
    fields: [
        {
            name: "slides",
            title: "Slides",
            type: "array",
            of: [
                {
                    type: "object",
                    name: "captionSlide",
                    components: { item: makeBackButtonItem("Caption Carousel") },
                    fields: [
                        { name: "image", title: "Image", type: "image", validation: Rule => Rule.custom((image, context) => image || context.parent?.video ? true : "Add an image or a video") },
                        { name: "video", title: "Video (optional, plays over image)", type: "file", options: { accept: "video/*" } },
                        { name: "caption", title: "Caption", type: "array", of: [{ type: "block" }] },
                    ],
                    preview: {
                        select: { media: "image", caption: "caption" },
                        prepare({ media, caption }) {
                            const text = caption?.[0]?.children?.[0]?.text || "Slide"
                            return { title: text, media }
                        },
                    },
                },
            ],
            validation: Rule => Rule.required().min(1),
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
            media: "slides.0.image",
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
