import { PortableText } from "next-sanity"
import FooterLightStrike from "./footerLightStrike"

export default function Footer({ data }) {
    return (
        <div className='p15 h-100vh pth text-grey-6 m-pt15'>
            <div className='bg-black radius-15 h-100 footer-light-strike-host'>
                <div className='p35 h-100 flex flex-col space-between'>
                    <div className='h3 text-footer max-500'>
                        <PortableText value={data.caption} />
                    </div>
                    <div className='flex gap-100 m-flex-wrap m-gap-50 footer-detail-row'>
                        {data.details.map((detail, index) => (
                            <div className='flex flex-col gap-30 m-gap-15' key={index}>
                                <p className='h5'>{detail.title}</p>
                                <div className='text-grey-4 nowrap'>
                                    <PortableText value={detail.detail} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-10">
                        <p className='h5 footer-copyright'>{data.copyright}</p>
                        <div className='logo--footer' />
                    </div>
                </div>
                <FooterLightStrike />
            </div>
        </div>
    )
}
