import { TextIcon } from "@sanity/icons"

export default {
    name: "textLarge",
    title: "Eyebrow Large",
    icon: TextIcon,
    type: "object",
    fields: [
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
                title: title || "Eyebrow Large",
                subtitle: "Eyebrow Large",
            }
        },
    },
}
