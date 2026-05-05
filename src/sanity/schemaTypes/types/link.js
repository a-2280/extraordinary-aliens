import { LinkIcon } from "@sanity/icons"

export default {
    name: "link",
    title: "Link",
    icon: LinkIcon,
    type: "object",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
            validation: Rule => Rule.required(),
        },
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
            name: "openInNewWindow",
            title: "Open In New Window",
            type: "boolean",
            layout: "checkbox",
        },
        {
            name: "copyOnClick",
            title: "Copy URL On Click",
            description: "When enabled, clicking the link copies its URL to the clipboard instead of navigating.",
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
