import Carousel from "./carousel"
import ImageCard from "./imageCard"
import CaptionCarousel from "./captionCarousel"
import AnnotationImageCard from "./annotationImageCard"
import ImageHotspot from "./imageHotspot"
import ImageExpandableCaption from "./imageExpandableCaption"

const REGISTRY = {
    imageCard: ImageCard,
    carousel: Carousel,
    captionCarousel: CaptionCarousel,
    annotationImage: AnnotationImageCard,
    imageHotspot: ImageHotspot,
    imageExpandableCaption: ImageExpandableCaption,
    // Add new component types here, keyed by their schema `name`:
    // credits: Credits,
    // textBlock: TextBlock,
}

export default function renderComponent(component) {
    if (!component) return null
    const C = REGISTRY[component._type]
    return C ? <C {...component} /> : null
}
