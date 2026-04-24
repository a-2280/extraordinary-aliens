import { PortableText } from "next-sanity"
import Image from "next/image"
import React from "react"

export default function Footer({ data }) {
    return (
        <div className='p15 h-100vh text-dark-grey'>
            <div className='bg-black radius-15 h-100'>
                <div className='p35 h-100 flex flex-col space-between'>
                    <div className='h3 text-grey'>
                        <PortableText value={data.caption} />
                    </div>
                    <div className='flex gap-100'>
                        {data.details.map((detail, index) => (
                            <div className='flex flex-col gap-30' key={index}>
                                <p className='h5'>{detail.title}</p>
                                <div className='text-light-grey'>
                                    <PortableText value={detail.detail} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-20">
                        <p className='h5'>{data.copyright}</p>
                        <div className='logo--footer' />
                    </div>
                </div>
            </div>
        </div>
    )
}
