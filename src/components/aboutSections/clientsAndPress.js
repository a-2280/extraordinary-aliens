import { PortableText } from "@portabletext/react"
import Spacer from "../spacer"

export default function ClientsAndPress({ title, clients, pressTitle, press }) {
    return (
        <div className='py30 px80 flex gap-30 m-flex-col m-p0 m-px30' data-sal>
            <p className='m-show h2 m-pb50'>Capabilities</p>
            <div className='flex-1 flex flex-col gap-10'>
                <p className='h4 fade--in' data-sal>
                    {title}
                </p>
                {clients && (
                    <div className='f-20 text-grey-4 fade--in delay-100' data-sal>
                        <PortableText value={clients} />
                    </div>
                )}
            </div>
            <div className='flex-1 flex flex-col gap-10'>
                <p className='h4 fade--in' data-sal>
                    {pressTitle}
                </p>
                {press && (
                    <div className='f-20 text-grey-4 fade--in delay-100' data-sal>
                        <PortableText value={press} />
                    </div>
                )}
            </div>
        </div>
    )
}
