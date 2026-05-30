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
        {
            name: "bunnyVideoId",
            title: "Bunny video ID (for large videos)",
            type: "string",
            description: "Paste the video's ID from the Bunny Stream library. Takes priority over an uploaded file.",
        },
    ],
    preview: {
        select: { media: "image" },
        prepare({ media }) {
            return { title: "Media", media }
        },
    },
}
