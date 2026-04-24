import { ComponentIcon } from "@sanity/icons"

export const components = [
    { type: "hero" },
]

export default {
    name: "pageComponentList",
    title: "Components",
    icon: ComponentIcon,
    type: "array",
    of: [
        ...components,
        {
            name: "globalComponentList",
            title: "Global Component List",
            type: "reference",
            to: [{ type: "globalComponentList" }],
        },
    ],
}
