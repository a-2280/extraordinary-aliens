import { ImageIcon } from "@sanity/icons"

export default {
    name: "audioPlayer",
    title: "Audio Player",
    icon: ImageIcon,
    type: "object",
    fields: [
        {
            name: "audio",
            title: "Audio File",
            type: "file",
            options: { accept: "audio/*" },
            validation: Rule => Rule.required(),
        },
        {
            name: "description",
            title: "Description",
            type: "text",
        },
        {
            name: "title",
            title: "Title",
            type: "string",
        }
    ],
    preview: {
        select: {
            title: "title",
        },
        prepare({ title }) {
            return {
                title: title || "Audio Player",
                subtitle: "Audio Player",
            }
        },
    },
}
