import { PlayIcon } from "@sanity/icons"

export default {
    name: "videoModal",
    title: "Video Modal",
    icon: PlayIcon,
    type: "object",
    fields: [
        {
            name: "video",
            title: "Video File",
            type: "file",
            options: { accept: "video/*" },
        },
        {
            name: "bunnyVideoId",
            title: "Bunny video ID (for large videos)",
            type: "string",
            description: "Paste the long video's ID from the Bunny Stream library. Plays as adaptive HLS; takes priority over an uploaded file.",
        },
        {
            name: "title",
            title: "Title",
            type: "string",
        },
        {
            name: "description",
            title: "Description",
            type: "text",
        },
    ],
    preview: {
        select: {
            title: "title",
        },
        prepare({ title }) {
            return {
                title: title || "Video Modal",
                subtitle: "Video Modal",
            }
        },
    },
}
