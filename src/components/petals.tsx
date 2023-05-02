import { twMerge } from "tailwind-merge";

type PetalState = {
    state: "thinking" | "speaking" | "listening" | "idle";
}

export default function Petals(props: {
    state: PetalState;
    onClick?: () => void;
}) {

    const petals = ["bg-green-700 -bottom-[25px] -right-[25px]", "bg-green-800 -bottom-[25px] -left-[25px]", "bg-green-800 -top-[25px] -right-[25px]", "bg-green-700 -top-[25px] -left-[25px]"]

    return (
        <div className="flex items-center h-96 justify-center">
            <div className="relative">
                {petals.map((petal, i) => (
                    <div key={i} className={twMerge("opacity-50 h-52 w-52 rounded-[90px] absolute", petal)}>

                    </div>
                ))}
            </div>
        </div>
    )
}