import { ImageIcon } from "@sanity/icons"

export default {
    name: "mediaSlide",
    title: "Media",
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
    ],
    preview: {
        select: { media: "image" },
        prepare({ media }) {
            return { title: "Media", media }
        },
    },
}
