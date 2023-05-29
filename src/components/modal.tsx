export default function Modal(props: {
    show: boolean,
    onClose: () => void,
    children: React.ReactNode
}) {

    const { show, onClose, children } = props;

    return (
        <div className={`inset-0 fixed z-10 flex items-center justify-center transition-all ${show ? "opacity-100 visible" : "opacity-0 invisible"}`}>
            <div onClick={onClose} className={`bg-black/40 absolute inset-0 -z-10`} />
            <div className={`bg-white md:rounded-xl w-full md:w-[800px] h-full md:h-[500px] p-8 relative transition-all ${show ? "scale-100" : "scale-[0.2]"} overflow-auto`}>
                <button onClick={onClose} className="absolute top-4 right-6 text-xl">
                    <i className="far fa-times" />
                </button>
                {children}
            </div>
        </div>
    )
}