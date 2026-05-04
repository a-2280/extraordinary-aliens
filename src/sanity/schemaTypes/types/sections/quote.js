import { TextIcon } from "@sanity/icons"

export default {
    name: "quote",
    title: "Quote",
    icon: TextIcon,
    type: "object",
    fields: [
        {
            name: "quote",
            title: "Quote",
            type: "text",
        },
    ],
    preview: {
        select: {
            quote: "quote",
        },
        prepare({ quote }) {
            return {
                title: "Quote",
                subtitle: quote || "",
            }
        },
    },
}
