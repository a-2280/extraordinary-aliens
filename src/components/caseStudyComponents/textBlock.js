export default function TextBlock({ title, description }) {
    return (
        <div className='flex flex-col gap-15 fade--in' data-sal>
            {title && <p className='h5'>{title}</p>}
            <p className='f-20 text-grey-4 max-400 text-block-body'>{description}</p>
        </div>
    )
}
