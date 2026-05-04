import { TextIcon } from "@sanity/icons"

export default {
    name: "textBlock",
    title: "Text",
    icon: TextIcon,
    type: "object",
    fields: [
        {
            name: "title",
            title: "Title (optional)",
            type: "string",
        },
        {
            name: "description",
            title: "Text",
            type: "text",
            validation: Rule => Rule.required(),
        },
    ],
    preview: {
        select: {
            title: "title",
            description: "description",
        },
        prepare({ title, description }) {
            return {
                title: title || "Text",
                subtitle: description || "",
            }
        },
    },
}
