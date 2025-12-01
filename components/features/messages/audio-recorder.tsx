'use client'

import { useState, useRef, useEffect } from "react"
import { Mic, Square, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sendVoiceMessage } from "./messages.actions"
import { toast } from "sonner"
import { usePreferences } from "@/hooks/use-preferences"

interface AudioRecorderProps {
    conversationId: string
}

export function AudioRecorder({ conversationId }: AudioRecorderProps) {
    const [isRecording, setIsRecording] = useState(false)
    const [duration, setDuration] = useState(0)
    const [sending, setSending] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const { vibrate } = usePreferences()

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [])

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            chunksRef.current = []

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data)
                }
            }

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
                stream.getTracks().forEach(track => track.stop())

                console.log('Audio recorded, blob size:', audioBlob.size)

                if (chunksRef.current.length > 0 && !sending) {
                    setSending(true)

                    try {
                        const result = await sendVoiceMessage(conversationId, audioBlob)

                        if (result.error) {
                            console.error('Voice send error:', result.error)
                            toast.error(result.error)
                        } else {
                            vibrate(20)
                            toast.success("Message vocal envoyé")
                        }
                    } catch (error) {
                        console.error('Voice send exception:', error)
                        toast.error("Erreur lors de l'envoi")
                    }

                    setSending(false)
                }

                setDuration(0)
            }

            mediaRecorder.start()
            setIsRecording(true)
            vibrate(10)

            // Start timer
            let seconds = 0
            timerRef.current = setInterval(() => {
                seconds++
                setDuration(seconds)

                // Auto-stop at 60 seconds
                if (seconds >= 60) {
                    stopRecording()
                }
            }, 1000)

        } catch (error) {
            console.error('Error accessing microphone:', error)
            toast.error("Impossible d'accéder au microphone")
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)

            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }

    const cancelRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            chunksRef.current = [] // Clear chunks to prevent sending
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            setDuration(0)

            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (isRecording) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2 flex-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-mono">{formatDuration(duration)}</span>
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={cancelRecording}
                    className="h-8 w-8"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="default"
                    size="icon"
                    onClick={stopRecording}
                    className="h-8 w-8"
                >
                    <Square className="h-4 w-4" />
                </Button>
            </div>
        )
    }

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={startRecording}
            disabled={sending}
            className="rounded-lg"
        >
            <Mic className="h-5 w-5" />
        </Button>
    )
}
