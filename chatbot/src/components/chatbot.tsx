import React, { useState } from 'react';
import "../index.css";
import { ChatbotProps } from '../types';

export default function Chatbot(props: ChatbotProps) {

    const [show, setShow] = useState(false);

    const { containerClass, buttonClass, chatboxClass, presetQuestions } = props;

    return (
        <div className={`ac-container ${containerClass!}`}>
            <button className={`ac-chat-button ${buttonClass!}`} onClick={() => setShow(!show)}>
                <img src="https://ayushma.ohc.network/ayushma.svg" alt="Ayushma" />
            </button>
            <div className={`ac-chatbox ${show ? "ac-show" : ""}`}>
                <div className={`ac-chatbox-hero`}>
                    <div className='ac-chatbox-hero-icon'>
                        <img src="https://ayushma.ohc.network/ayushma.svg" alt="Ayushma" />
                    </div>
                    Ayushma
                </div>
                <div className='ac-chatbox-container'>
                    <p>
                        Hey! I am Ayushma, your digital personal health assistant. I can help you with queries regarding patient health and ICU protocols.
                    </p>
                    <br />

                    {presetQuestions && (
                        <div className='ac-preset-question-list'>
                            {presetQuestions.map((question, index) => (
                                <button key={index} className='ac-preset-question'>
                                    {question}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}