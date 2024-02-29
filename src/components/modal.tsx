import { twMerge } from "tailwind-merge";

export default function Modal(props: {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const { show, onClose, children, className } = props;

  return (
    <div
      className={`absolute w-screen p-2 inset-0 z-10 flex items-center justify-center transition-all ${show ? "block" : "hidden"
        }`}
    >
      <div onClick={onClose} className={`bg-black/40 absolute inset-0 -z-10`} />
      <div
        className={twMerge(
          `bg-primary md:rounded-xl w-fit h-fit p-8 relative transition-all ${show ? "scale-100 opacity-100" : "scale-[0.8] opacity-0"
          } overflow-auto`,
          className,
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-xl text-gray-500 hover:text-primaryFont "
        >
          <i className="far fa-times" />
        </button>
        {children}
      </div>
    </div>
  );
}
