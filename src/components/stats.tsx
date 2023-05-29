import { ChatMessage } from "@/types/chat"

export default function Stats(props: {
    message: ChatMessage
}) {

    const { message } = props;

    type TimeStat = {
        type: "time",
        start?: number,
        end?: number
    }

    type ValueStat = {
        type: "value",
        value?: number
    }

    type Stat = {
        name: string,
    } & (TimeStat | ValueStat)

    const stats: Stat[] = [
        {
            name: "Top K",
            type: "value",
            value: message?.top_k,
        },
        {
            name: "Temperature",
            type: "value",
            value: message?.temperature,
        },
        {
            name: "Fetched References",
            type: "time",
            start: message?.meta?.reference_start,
            end: message?.meta?.reference_end,
        },
        {
            name: "Response Time",
            type: "time",
            start: message?.meta?.response_start,
            end: message?.meta?.response_end,
        },
        {
            name: "Translation Time",
            type: "time",
            start: message?.meta?.translate_start,
            end: message?.meta?.translate_end,
        },
        {
            name: "Audio Generation Time",
            type: "time",
            start: message?.meta?.tts_start,
            end: message?.meta?.tts_end,
        },
        {
            name: "Upload Time",
            type: "time",
            start: message?.meta?.upload_start,
            end: message?.meta?.upload_end,
        },
    ]

    const ranges = [
        {
            till: 1.5,
            color: "text-green-500"
        },
        {
            till: 2.5,
            color: "text-yellow-500"
        },
        {
            till: 3.5,
            color: "text-red-500"
        }
    ]

    return (
        <div className="flex gap-x-8 gap-y-2 text-xs text-gray-500 flex-wrap">
            {stats.map((stat, index) => {

                let color = "text-gray-500";
                let value = null;

                switch (stat.type) {
                    case "value":
                        value = stat.value;
                        break;
                    case "time":
                        const start = stat.start || null;
                        const end = stat.end || null;
                        if (!start || !end) break;
                        value = (end - start).toFixed(2) + "s";
                        color = ranges.find(range => (end - start) < range.till)?.color || "text-red-600"
                        break;
                }

                if (!value) return null;

                return <div key={index}>
                    {stat.name} :&nbsp;
                    <span className={`${color}`}>
                        {value}
                    </span>
                </div>
            })}
        </div>
    )
}