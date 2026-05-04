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
