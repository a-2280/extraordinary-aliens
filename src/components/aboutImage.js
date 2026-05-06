import Image from "next/image";
import Spacer from "./spacer";

export default function AboutImage({ image }) {
    if (!image) return null
    return (
        <>
            <Spacer />
            <div className='h-100vh pth px200'>
                <div className='pos-rel ratio-16-10 overflow radius-15 bg-grey'>
                    <Image className='bg-image' src={image} alt="About Image" width={1600} height={1000} />
                </div>
            </div>
        </>
    )
}