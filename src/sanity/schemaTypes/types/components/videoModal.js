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
