import { SplitVerticalIcon } from "@sanity/icons"
import { makeBackButtonItem } from "../../components/BackButtonItem"

// Components that can be picked inside a Split section's left/right slots,
// AND that can be added directly to the top-level case study sections list.
export const sectionComponents = [
    { type: "imageCard", title: "Image" },
    { type: "carousel", title: "Carousel" },
    { type: "captionCarousel", title: "Caption Carousel" },
    { type: "annotationImage", title: "Annotation Image" },
    { type: "imageHotspot", title: "Hotspot Image" },
    { type: "imageExpandableCaption", title: "Image with expandable caption" },
    { type: "imageCaptionHover", title: "Image with hover caption" },
    { type: "audioPlayer", title: "Audio Player"},
    { type: "textBlock", title: "Text" },
]

const withBack = (label) =>
    sectionComponents.map(c => ({ ...c, components: { item: makeBackButtonItem(label) } }))

const titleFor = (type) =>
    sectionComponents.find(c => c.type === type)?.title || "—"

const isFullWidth = (side) => side?.[0]?.variant === "fullWidth"

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
            of: withBack("Section (left)"),
            readOnly: ({ parent }) => isFullWidth(parent?.right),
            validation: Rule =>
                Rule.max(1).custom((value, { parent }) => {
                    if (isFullWidth(parent?.right)) return true
                    if (!value || value.length !== 1) return "Must contain exactly 1 component"
                    return true
                }),
        },
        {
            name: "right",
            title: "Right",
            type: "array",
            of: withBack("Section (right)"),
            readOnly: ({ parent }) => isFullWidth(parent?.left),
            validation: Rule =>
                Rule.max(1).custom((value, { parent }) => {
                    if (isFullWidth(parent?.left)) return true
                    if (!value || value.length !== 1) return "Must contain exactly 1 component"
                    return true
                }),
        },
    ],
    preview: {
        select: {
            leftType: "left.0._type",
            rightType: "right.0._type",
        },
        prepare({ leftType, rightType }) {
            return {
                title: `Split: ${titleFor(leftType)} + ${titleFor(rightType)}`,
            }
        },
    },
}
