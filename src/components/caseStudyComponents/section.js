import renderComponent from "./registry"

const isFullWidth = side => side?.[0]?.variant === "fullWidth"
const startsSection = side => side?.[0]?._type === "textBlock"
const hasCaptionCarousel = side => side?.[0]?._type === "captionCarousel"
const hasAudioPlayer = side => side?.[0]?._type === "audioPlayer"

export default function Section({ left, right }) {
    const needsTopPad = startsSection(left) || startsSection(right) || hasAudioPlayer(left) || hasAudioPlayer(right)
    const isSplit = left?.length > 0 && right?.length > 0
    const wrapperPadding = needsTopPad ? (isSplit ? " pt90" : " pt90 pb100") : ""
    if (isFullWidth(left)) {
        return (
            <div className={`w-100${wrapperPadding}`}>
                {left.map(c => <div key={c._key}>{renderComponent(c)}</div>)}
            </div>
        )
    }
    if (isFullWidth(right)) {
        return (
            <div className={`w-100${wrapperPadding}`}>
                {right.map(c => <div key={c._key}>{renderComponent(c)}</div>)}
            </div>
        )
    }
    const leftCaption = hasCaptionCarousel(left)
    const rightCaption = hasCaptionCarousel(right)
    const leftNeedsSpacer = rightCaption && !leftCaption
    const rightNeedsSpacer = leftCaption && !rightCaption
    return (
        <div className={`flex gap-15 m-flex-col${wrapperPadding}`}>
            <div className='flex-1 min-w-0'>
                {left?.map(c => <div key={c._key}>{renderComponent(c)}</div>)}
                {leftNeedsSpacer && <div className='caption-row h4 p15 m-hide' aria-hidden />}
            </div>
            <div className='flex-1 min-w-0'>
                {right?.map(c => <div key={c._key}>{renderComponent(c)}</div>)}
                {rightNeedsSpacer && <div className='caption-row h4 p15 m-hide' aria-hidden />}
            </div>
        </div>
    )
}
