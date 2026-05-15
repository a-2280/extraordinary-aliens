import { TextIcon } from "@sanity/icons"
import { makeBackButtonItem } from "../../../components/BackButtonItem"

export default {
    name: "credit",
    title: "Credit",
    icon: TextIcon,
    type: "object",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
        },
        {
            name: "creditInfo",
            title: "Credit Info",
            type: "array",
            of: [{ type: "creditInfo", components: { item: makeBackButtonItem("Credit") } }],
        },
    ],
    preview: {
        select: {
            title: "title",
            creditInfo: "creditInfo",
        },
        prepare({ title, creditInfo }) {
            const count = Array.isArray(creditInfo) ? creditInfo.length : 0
            return {
                title: title || "Untitled credit",
                subtitle: count ? `${count} credit${count === 1 ? "" : "s"}` : undefined,
            }
        },
    },
}
