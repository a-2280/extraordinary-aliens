import renderComponent from "./registry"

const isFullWidth = side => side?.[0]?.variant === "fullWidth"
const startsSection = side => side?.[0]?._type === "textBlock"
const hasCaptionCarousel = side => side?.[0]?._type === "captionCarousel"

export default function Section({ left, right }) {
    const sectionStart = startsSection(left) || startsSection(right) ? " pt90" : ""
    if (isFullWidth(left)) {
        return (
            <div className={`w-100${sectionStart}`}>
                {left.map(c => <div key={c._key}>{renderComponent(c)}</div>)}
            </div>
        )
    }
    if (isFullWidth(right)) {
        return (
            <div className={`w-100${sectionStart}`}>
                {right.map(c => <div key={c._key}>{renderComponent(c)}</div>)}
            </div>
        )
    }
    const leftCaption = hasCaptionCarousel(left)
    const rightCaption = hasCaptionCarousel(right)
    const leftNeedsSpacer = rightCaption && !leftCaption
    const rightNeedsSpacer = leftCaption && !rightCaption
    const isPaired = left?.length > 0 && right?.length > 0
    const splitMobileTrim = sectionStart && isPaired ? " m-pt0" : ""
    return (
        <div className={`flex gap-15 m-flex-col${sectionStart}${splitMobileTrim}`}>
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
