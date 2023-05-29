import { ChatMessage } from "@/types/chat"

export default function Stats(props: {
    message: ChatMessage
}) {

    const { message } = props;

    const stats = [
        {
            name: "Fetched References",
            start: message?.meta?.reference_start,
            end: message?.meta?.reference_end,
        },
        {
            name: "Response Time",
            start: message?.meta?.response_start,
            end: message?.meta?.response_end,
        },
        {
            name: "Translation Time",
            start: message?.meta?.translate_start,
            end: message?.meta?.translate_end,
        },
        {
            name: "Audio Generation Time",
            start: message?.meta?.tts_start,
            end: message?.meta?.tts_end,
        },
        {
            name: "Upload Time",
            start: message?.meta?.upload_start,
            end: message?.meta?.upload_end,
        },
    ]

    const ranges = [
        {
            till: 1500,
            color: "text-green-500"
        },
        {
            till: 2500,
            color: "text-yellow-500"
        },
        {
            till: 3500,
            color: "text-red-500"
        }
    ]

    return (
        <div className="flex gap-8 text-xs text-gray-500">
            {stats.map((stat, index) => {

                const start = stat.start || null;
                const end = stat.end || null;

                if (!start || !end) return null;

                const color = ranges.find(range => (end - start) * 1000 < range.till)?.color || "text-red-600"

                return <div key={index}>
                    {stat.name} :&nbsp;
                    <span className={`${color}`}>
                        {(end - start).toFixed(2)}s
                    </span>
                </div>
            })}
        </div>
    )
}