import { components } from "./pageComponentList"
import { EarthGlobeIcon } from "@sanity/icons"

export default {
    name: "globalComponentList",
    title: "Global Component List",
    icon: EarthGlobeIcon,
    type: "document",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
            description: "Only used internally in the CMS",
            validation: Rule => Rule.required(),
        },

        {
            name: "components",
            title: "Components",
            type: "array",
            of: components,
        },
    ],
    preview: {
        select: {
            title: "title",
        },
    },
}
