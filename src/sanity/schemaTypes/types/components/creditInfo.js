import { TextIcon } from "@sanity/icons"

export default {
    name: "creditInfo",
    title: "Credit Info",
    icon: TextIcon,
    type: "object",
    fields: [
        {
            name: "credit",
            title: "Credit",
            type: "string",
        },
        {
            name: "image",
            title: "Image",
            type: "image",
        },
    ],
    preview: {
        select: {
            credit: "credit",
        },
        prepare({ credit }) {
            return {
                title: credit || "Untitled credit",
            }
        },
    },
}
