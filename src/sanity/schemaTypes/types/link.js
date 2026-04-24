import { LinkIcon } from "@sanity/icons"

export default {
    name: "link",
    title: "Link",
    icon: LinkIcon,
    type: "object",
    fields: [
        {
            name: "url",
            title: "URL",
            type: "url",
            validation: Rule =>
                Rule.required().uri({
                    allowRelative: true,
                    scheme: ["http", "https", "tel", "sms", "mailto"],
                }),
        },
        {
            name: "title",
            title: "Title",
            type: "string",
            validation: Rule => Rule.required(),
        },
        {
            name: "openInNewWindow",
            title: "Open In New Window",
            type: "boolean",
            layout: "checkbox",
        },
    ],
    preview: {
        select: {
            title: "title",
        },
    },
}
