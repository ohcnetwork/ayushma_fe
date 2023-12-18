import { useState, useCallback } from 'react';
import AudioRecorder from 'audio-recorder-polyfill';

type UseAudioRecorderReturn = {
    status: string,
    startRecording: () => void,
    stopRecording: () => void,
    mediaBlobUrl: string | null,
};

export const useAudioRecorder = (onStop?: (url: string) => void): UseAudioRecorderReturn => {
    const [status, setStatus] = useState('idle');
    const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

    const startRecording = useCallback(() => {
        if (status !== 'idle') return;

        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            setMediaStream(stream);

            const recorder = new AudioRecorder(stream);
            setMediaRecorder(recorder);

            const audioChunks: BlobPart[] = [];
            recorder.addEventListener('dataavailable', (event: any) => audioChunks.push(event.data));
            recorder.addEventListener('stop', () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setMediaBlobUrl(audioUrl);
                onStop?.(audioUrl);
                setStatus('stopped');
            });

            recorder.start();
            setStatus('recording');
        }).catch(error => {
            console.error('Error accessing media devices:', error);
        });
    }, [status, onStop]);

    const stopRecording = useCallback(() => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            mediaStream?.getTracks().forEach(track => track.stop());
            setMediaStream(null);
        }
    }, [mediaRecorder, mediaStream]);

    return { status, startRecording, stopRecording, mediaBlobUrl };
};
