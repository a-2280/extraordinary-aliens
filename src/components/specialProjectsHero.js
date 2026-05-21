export default function SpecialProjectsHero({ title }) {
    return (
        <div className='h-75vh pth'>
            <div className='h-100 flex align-center p15 max-850'>
                <p className='p15 pb60 h1 fade--in' data-sal>
                    {title}
                </p>
            </div>
        </div>
    )
}
