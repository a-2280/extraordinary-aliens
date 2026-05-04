import { TextIcon } from "@sanity/icons"
import { makeBackButtonItem } from "../../../components/BackButtonItem"

export default {
    name: "credits",
    title: "Credits",
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
        {
            name: "credits",
            title: "Credits",
            type: "array",
            of: [{ type: "credit", components: { item: makeBackButtonItem("Credits") } }],
        },
    ],
    preview: {
        select: {
            title: "title",
            credits: "credits",
        },
        prepare({ title, credits }) {
            const count = Array.isArray(credits) ? credits.length : 0
            return {
                title: title || "Credits",
                subtitle: count ? `${count} credit${count === 1 ? "" : "s"}` : undefined,
            }
        },
    },
}
