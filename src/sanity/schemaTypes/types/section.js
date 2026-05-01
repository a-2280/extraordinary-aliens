import { SplitVerticalIcon } from "@sanity/icons"

// Components that can be picked inside a Split section's left/right slots,
// AND that can be added directly to the top-level case study sections list.
export const sectionComponents = [
    { type: "imageComponent" },
    // Add new component object types here:
    // { type: "carouselComponent" },
    // { type: "captionCarouselComponent" },
    // { type: "annotationImageCardComponent" },
    // { type: "textComponent" },
]

export default {
    name: "section",
    title: "Split (left + right)",
    icon: SplitVerticalIcon,
    type: "object",
    fields: [
        {
            name: "left",
            title: "Left",
            type: "array",
            of: sectionComponents,
            validation: Rule => Rule.required().min(1).max(1),
        },
        {
            name: "right",
            title: "Right",
            type: "array",
            of: sectionComponents,
            validation: Rule => Rule.required().min(1).max(1),
        },
    ],
    preview: {
        select: {
            leftType: "left.0._type",
            rightType: "right.0._type",
        },
        prepare({ leftType, rightType }) {
            return {
                title: `Split: ${leftType || "—"} + ${rightType || "—"}`,
            }
        },
    },
}
