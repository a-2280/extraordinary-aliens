import renderComponent from "./registry"

const isFullWidth = side => side?.[0]?.variant === "fullWidth"

export default function Section({ left, right }) {
    if (isFullWidth(left)) {
        return (
            <div className='w-100'>
                {left.map(c => <div key={c._key}>{renderComponent(c)}</div>)}
            </div>
        )
    }
    if (isFullWidth(right)) {
        return (
            <div className='w-100'>
                {right.map(c => <div key={c._key}>{renderComponent(c)}</div>)}
            </div>
        )
    }
    return (
        <div className='flex gap-15 m-flex-col'>
            <div className='flex-1 min-w-0'>
                {left?.map(c => <div key={c._key}>{renderComponent(c)}</div>)}
            </div>
            <div className='flex-1 min-w-0'>
                {right?.map(c => <div key={c._key}>{renderComponent(c)}</div>)}
            </div>
        </div>
    )
}
