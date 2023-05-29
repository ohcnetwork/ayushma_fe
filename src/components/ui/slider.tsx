export default function Slider(props: {
    max: number,
    min?: number,
    value: number,
    onChange: (value: number) => void,
    step?: number,
    disabled?: boolean,
    left?: React.ReactNode,
    right?: React.ReactNode,
}) {

    const { max, min = 0, value, onChange, step = 1, disabled } = props;

    return (
        <div>
            <div className="grid grid-cols-3 items-center text-xs text-gray-500">
                <div>
                    {props.left}
                </div>
                <div className="text-center text-base text-green-500">
                    {value}
                </div>
                <div className="text-right">
                    {props.right}
                </div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                step={step}
                disabled={disabled}
                className="w-full slider"
            />
        </div>
    )
}