import { twMerge } from "tailwind-merge";

export function Input(props: {
    errors?: string[],
    loading?: boolean,
    right?: React.ReactNode,
    left?: React.ReactNode,
} & React.InputHTMLAttributes<HTMLInputElement>) {

    const { className, loading, errors, right, left, ...rest } = props;

    return (
        <div>
            <div className="border border-gray-200 w-full bg-white rounded-lg overflow-hidden relative transition-all flex ring-0 ring-green-500 focus-within:ring-2 focus-within:ring-offset-1">
                {loading && (
                    <div className="absolute inset-0 bg-black/10" />
                )}
                {left}
                <input {...rest} className={twMerge("border-none bg-transparent flex-1 p-2 px-4 outline-none", className)} disabled={loading} />
                {right}
            </div>
            <Errors errors={errors} />
        </div>
    )
}

export function TextArea(props: {
    errors?: string[],
    loading?: boolean,
    right?: React.ReactNode,
    left?: React.ReactNode,
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    const { className, loading, errors, right, left, ...rest } = props;

    return (
        <div>
            <div className="border border-gray-200 w-full bg-white rounded-lg overflow-hidden relative transition-all flex ring-0 ring-green-500 focus-within:ring-2 focus-within:ring-offset-1">
                {loading && (
                    <div className="absolute inset-0 bg-black/10" />
                )}
                {left}
                <textarea {...rest} className={twMerge("border-none bg-transparent flex-1 p-2 px-4 outline-none", className)} disabled={loading} />
                {right}
            </div>
            <Errors errors={errors} />
        </div>
    )
}

export function Button(props: {
    children: React.ReactNode,
    loading?: boolean,
    variant?: "primary" | "secondary",
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const { children, className, loading, ...rest } = props;

    const baseClasses = "rounded-lg p-2 px-4 flex items-center justify-center";
    const primaryClasses = "bg-green-500 hover:bg-green-600 transition-all text-white";
    const secondaryClasses = "bg-white hover:bg-slate-200 transition-all text-gray-700";
    const classes = twMerge(baseClasses, props.variant === "secondary" ? secondaryClasses : primaryClasses, className);
    return (
        <button {...rest} className={classes}>
            {children}
        </button>
    )
}

export function Errors(props: {
    errors?: string[]
}) {
    const { errors } = props;

    return (
        <div className="flex flex-col">
            {errors?.map((error, i) => <div key={i} className="text-red-500 text-sm mt-2">{error}</div>)}
        </div>
    )
}

export function CheckBox(props: {
    label: string,
} & React.InputHTMLAttributes<HTMLInputElement>) {
    const { label, ...rest } = props;

    return (
        <label className="flex items-center">
            <input type="checkbox" {...rest} className="mr-2" />
            {label}
        </label>
    )
}