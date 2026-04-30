import { LinkIcon } from "@sanity/icons"

export default {
    name: "missionCard",
    title: "Mission Card",
    icon: LinkIcon,
    type: "object",
    fields: [
        {
            name: "image",
            title: "Image",
            type: "image",
            validation: Rule => Rule.required(),
        },
        {
            name: "title",
            title: "Title",
            type: "string",
            validation: Rule => Rule.required(),
        },
        {
            name: "caption",
            title: "Caption",
            type: "text",
            validation: Rule => Rule.required(),
        },
        {
            name: "description",
            title: "Description",
            type: "text",
            validation: Rule => Rule.required(),
        },
    ],
    preview: {
        select: {
            title: "title",
        },
    },
}
