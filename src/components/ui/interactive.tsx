import { twMerge } from "tailwind-merge";

export function Input(props: {
    errors?: string[],
    loading?: boolean,
} & React.InputHTMLAttributes<HTMLInputElement>) {

    const { className, loading, errors, ...rest } = props;

    return (
        <div>
            <div className="border border-gray-200 w-full bg-white rounded-lg overflow-hidden relative transition-all flex ring-0 ring-green-500 focus-within:ring-2 focus-within:ring-offset-1">
                {loading && (
                    <div className="absolute inset-0 bg-black/30">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500 inline-block"></div>
                    </div>
                )}
                <input {...rest} className={twMerge("border-none bg-transparent flex-1 p-2 px-4 outline-none", className)} disabled={loading} />
            </div>
            <Errors errors={errors} />
        </div>
    )
}

export function Button(props: {
    children: React.ReactNode,
    loading: boolean,
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {

    const { children, className, loading, ...rest } = props;

    return (
        <button
            {...rest}
            className={twMerge("bg-green-500 hover:bg-green-600 transition-all text-white rounded-lg p-2 px-4 flex items-center justify-center", className)}
        >
            {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block"></div> : children}
        </button>
    )
}

export function Errors(props: {
    errors?: string[]
}) {
    const { errors } = props;

    return (
        <div className="flex flex-col gap-2">
            {errors?.map((error, i) => <div key={i} className="text-red-500 text-sm mt-2">{error}</div>)}
        </div>
    )
}