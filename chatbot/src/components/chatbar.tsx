import React from 'react';

export default function ChatBar(props: {
    value: string,
    onChange: (value: string) => void,
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void,
    placeholder?: string,
    loading?: boolean,
}) {

    const { value, onChange, onSubmit, placeholder, loading } = props;

    return (
        <form className='bg-gray-100 border border-gray-200 text-sm rounded w-full flex items-center justify-between' onSubmit={onSubmit}>
            <input
                type="text"
                className='p-2 flex-1 outline-none bg-transparent'
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            <button type="submit" className='text-green-600 font-bold px-2 text-xs'>
                {loading ? <span>
                    🤔
                </span> : "📩"}
            </button>
        </form>
    )
}