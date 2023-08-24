import React from 'react'

export default function Landing(props: { presetQuestions: string[], createChat: (value: string) => void }) {

    const { presetQuestions, createChat } = props;

    return (
        <div>
            <div className={`p-4 flex items-center justify-center font-black text-xl gap-2`}>
                <div className='w-10'>
                    <img src="https://ayushma.ohc.network/logo.svg" alt="Ayushma" className='w-full' />
                </div>
                Ayushma
            </div>
            <div className='p-4 pt-0 text-sm'>
                <p>
                    Hey! I am Ayushma, your digital personal health assistant. I can help you with queries regarding patient health and ICU protocols.
                </p>
                <br />
                {presetQuestions && (
                    <div className='flex flex-col gap-4'>
                        {presetQuestions.map((question, index) => (
                            <button
                                key={index}
                                className='rounded border border-green-600 text-green-600 p-2 px-4 block w-full hover:bg-green-600 hover:text-white'
                                onClick={() => createChat(question)}
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}