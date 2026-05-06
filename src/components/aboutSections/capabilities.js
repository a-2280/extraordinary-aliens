import Spacer from "../spacer";

export default function Capabilities({ title, capabilities, industriesTitle, industries }) {
    return (
        <>
            <div className='py30 px80 flex gap-30' data-sal>
                <div className='flex-1 flex flex-col gap-10'>
                    <p className='h4 fade--in' data-sal>{title}</p>
                    {capabilities?.length > 0 && (
                        <div className='flex flex-col'>
                            {capabilities.map((c, i) => (
                                <p key={i} className='f-20 text-grey-4 fade--in delay-100' data-sal>
                                    {c.name}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
                <div className='flex-1 flex flex-col gap-10'>
                    <p className='h4 fade--in' data-sal>{industriesTitle}</p>
                    {industries?.length > 0 && (
                        <div className='flex flex-col'>
                            {industries.map((c, i) => (
                                <p key={i} className='f-20 text-grey-4 fade--in delay-100' data-sal>
                                    {c.name}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Spacer className="x2" />
        </>
    )
}
