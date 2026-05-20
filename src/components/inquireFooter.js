export default function InquireFooter({ inquire, hoveredButton, className = '' }) {
    return (
        <div className={`flex flex-col gap-15 m-pt10 m-pb20 ${className}`.trim()}>
            <div className='bg-grey pos-rel ratio-16-10 radius-15 overflow inquire-footer-image'>
                {inquire?.footerImage && <img className='bg-image' src={inquire.footerImage} alt='' />}
                {inquire?.footerVideo && <video className='bg-image' src={inquire.footerVideo} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />}
                {inquire?.buttons?.map((button, i) => (
                    <div key={button._key} className={`inquire-footer-hover${hoveredButton === i ? ' is-active' : ''}`}>
                        {button.image && <img className='bg-image' src={button.image} alt='' />}
                        {button.video && <video className='bg-image' src={button.video} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />}
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-3">
                <p className="h5">{inquire?.location}</p>
                <p className="h5 text-grey-5">{inquire?.copyright}</p>
            </div>
        </div>
    )
}
