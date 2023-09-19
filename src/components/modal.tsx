import { twMerge } from "tailwind-merge";

export default function Modal(props: {
    show: boolean,
    onClose: () => void,
    children: React.ReactNode
    className?: string
}) {

    const { show, onClose, children, className } = props;

    return (
        <div className={`inset-0 fixed z-10 flex items-center justify-center transition-all ${show ? "opacity-100 visible" : "opacity-0 invisible"}`}>
            <div onClick={onClose} className={`bg-black/40 absolute inset-0 -z-10`} />
            <div className={twMerge(`bg-white md:rounded-xl w-fit h-fit p-8 relative transition-all ${show ? "scale-100 opacity-100" : "scale-[0.8] opacity-0"} overflow-auto`, className)}>
                <button onClick={onClose} className="absolute top-4 right-6 text-xl text-gray-400 hover:text-black ">
                    <i className="far fa-times" />
                </button>
                {children}
            </div>
        </div>
    )
}