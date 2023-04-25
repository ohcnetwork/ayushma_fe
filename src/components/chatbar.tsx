import { Input } from "./ui/interactive";
import Loading from "./ui/loading";

export default function ChatBar(props: {
    chat: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
    errors: string[],
    loading?: boolean
}) {

    const { chat, onChange, onSubmit, errors, loading } = props;

    return (
        <form onSubmit={onSubmit}>
            <Input
                type="text"
                placeholder="Chat"
                value={chat || ""}
                onChange={onChange}
                loading={loading}
                errors={errors}
                right={loading ? <Loading /> : <button className="px-4 disabled:text-gray-300" disabled={chat.length < 1}>
                    <i className="fal fa-paper-plane-top" />
                </button>}
            />
        </form>
    )
}