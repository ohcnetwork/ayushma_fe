import React from 'react';
export default function ChatBar(props: {
    value: string;
    onChange: (value: string) => void;
    onSubmit?: () => void;
    placeholder?: string;
}): React.JSX.Element;
