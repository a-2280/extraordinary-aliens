import Spacer from "../spacer";

export default function Studio({ title, founderAndDirector, aboutTitle, about }) {
    return (
        <>
            <div className='py30 px80 flex gap-30' data-sal>
                <div className='flex-1 flex flex-col gap-10'>
                    <p className='h4 nowrap fade--in' data-sal>{title}</p>
                    {founderAndDirector?.length > 0 && (
                        <div>
                            {founderAndDirector.map((person, i) => (
                                <p key={i} className='f-20 text-grey-4 fade--in delay-100' data-sal>
                                    {person.name}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
                <div className='flex-1 flex flex-col gap-10'>
                    <p className='h4 fade--in' data-sal>{aboutTitle}</p>
                    <p className='f-20 text-grey-4 max-400 fade--in delay-100' data-sal>{about}</p>
                </div>
            </div>
            <Spacer className='x2' />
        </>
    )
}
