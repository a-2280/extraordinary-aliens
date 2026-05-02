import { ImageIcon } from "@sanity/icons"
import SpotPointInput from "../../../components/SpotPointInput"

export default {
    name: "spot",
    title: "Spot",
    icon: ImageIcon,
    type: "object",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
            validation: Rule => Rule.required(),
        },
        {
            name: "description",
            title: "Description",
            type: "array",
            of: [{ type: "block" }],
            validation: Rule => Rule.required(),
        },
        {
            name: "point",
            title: "Point",
            type: "object",
            components: { input: SpotPointInput },
            fields: [
                { name: "x", type: "number", validation: Rule => Rule.required().min(0).max(1) },
                { name: "y", type: "number", validation: Rule => Rule.required().min(0).max(1) },
            ],
            validation: Rule => Rule.required(),
        },
    ],
    preview: {
        select: { title: "title" },
        prepare({ title }) {
            return { title: title || "Spot" }
        },
    },
}
