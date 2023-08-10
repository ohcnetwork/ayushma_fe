import React from "react";
import { createRoot } from 'react-dom/client';
import Chatbot from "./components/chatbot";

export interface AyushmaProps {
    position?: "left" | "right",
    projectID: string,
    presetQuestions?: string[];
    api_url?: string;
    authToken: string;
}

export class Ayushma implements AyushmaProps {
    position: undefined | "left" | "right";
    projectID: string;
    presetQuestions: undefined | string[];
    api_url: undefined | string;
    authToken: string;
    constructor(props: AyushmaProps) {
        this.position = props.position || "right";
        this.projectID = props.projectID;
        this.presetQuestions = props.presetQuestions || [];
        this.api_url = props.api_url;
        this.authToken = props.authToken;
        this.render();
    }
    render() {
        const rootElement = document.createElement("div");
        rootElement.setAttribute("id", "ayushma-chatbot");
        document.body.appendChild(rootElement);
        const root = createRoot(rootElement);
        root.render(
            <React.StrictMode>
                <Chatbot
                    position={this.position}
                    projectID={this.projectID}
                    presetQuestions={this.presetQuestions}
                    api_url={this.api_url}
                    authToken={this.authToken}
                />
            </React.StrictMode>
        );
    }
}