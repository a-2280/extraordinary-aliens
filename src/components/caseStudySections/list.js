import Spacer from "../spacer";

export default function List({ title, list }) {
    return (
        <div>
            <Spacer />
            <div className='flex gap-15'>
                {title && <p className='flex-1 h5 fade--in' data-sal>{title}</p>}
                {list?.length > 0 && (
                    <div className='flex-1 p15 max-750 flex flex-col gap-25'>
                        {list.map((item, i) => (
                            <div key={item._key} className="flex flex-col gap-25 fade--in" data-sal>
                                <div className='flex flex-col gap-15'>
                                    {item.title && <p className='h4'>{item.title}</p>}
                                    {item.description && <p className='f-20 text-grey-4'>{item.description}</p>}
                                </div>
                                {i < list.length - 1 && <div className='b-1' data-sal />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Spacer />
        </div>
    )
}
