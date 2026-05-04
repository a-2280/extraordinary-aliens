import { TextIcon } from "@sanity/icons"

export default {
    name: "listItem",
    title: "List Item",
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
            description: "description",
        },
        prepare({ title, description }) {
            return {
                title: title || "List Item",
                subtitle: description || "",
            }
        },
    },
}
