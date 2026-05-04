import { TextIcon } from "@sanity/icons"
import { makeBackButtonItem } from "../../../components/BackButtonItem"

export default {
    name: "list",
    title: "List",
    icon: TextIcon,
    type: "object",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
        },
        {
            name: "list",
            title: "List",
            type: "array",
            of: [{ type: "listItem", components: { item: makeBackButtonItem("List") } }],
        },
    ],
    preview: {
        select: {
            title: "title",
        },
        prepare({ title }) {
            return {
                title: title || "List",
                subtitle: "List",
            }
        },
    },
}
