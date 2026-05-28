import Carousel from "./carousel"
import ImageCard from "./imageCard"
import CaptionCarousel from "./captionCarousel"
import AnnotationImageCard from "./annotationImageCard"
import ImageHotspot from "./imageHotspot"
import ImageExpandableCaption from "./imageExpandableCaption"
import ImageCaptionHover from "./imageCaptionHover"
import ImageTrio from "./imageTrio"
import AudioPlayer from "./audioPlayer"
import TextBlock from "./textBlock"

const REGISTRY = {
    imageCard: ImageCard,
    carousel: Carousel,
    captionCarousel: CaptionCarousel,
    annotationImage: AnnotationImageCard,
    imageHotspot: ImageHotspot,
    imageExpandableCaption: ImageExpandableCaption,
    imageCaptionHover: ImageCaptionHover,
    imageTrio: ImageTrio,
    audioPlayer: AudioPlayer,
    textBlock: TextBlock,
    // Add new component types here, keyed by their schema `name`:
    // credits: Credits,
}

export default function renderComponent(component) {
    if (!component) return null
    const C = REGISTRY[component._type]
    return C ? <C {...component} /> : null
}
