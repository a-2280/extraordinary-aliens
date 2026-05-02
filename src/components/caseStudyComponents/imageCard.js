import Image from "next/image"
import { RiExpandDiagonalSLine } from "react-icons/ri"

export default function ImageCard({ image, variant = "normal" }) {
    if (!image) return null
    return (
        <div className={`variant-${variant} pos-rel ratio-3-4 max-full radius-15 overflow`}>
            <button className="button-secondary pos-abs top-30 left-30 z-2">
                <RiExpandDiagonalSLine size={15} strokeWidth={.01} />
            </button>
            <Image className='bg-image' src={image} alt='' width={1600} height={1000} />
        </div>
    )
}
