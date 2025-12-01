'use client'

import { useState } from "react"
import { Calendar, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { sendMeetingRequest } from "./messages.actions"
import { toast } from "sonner"
import { usePreferences } from "@/hooks/use-preferences"

interface MeetingSchedulerProps {
    conversationId: string
}

export function MeetingScheduler({ conversationId }: MeetingSchedulerProps) {
    const [open, setOpen] = useState(false)
    const [sending, setSending] = useState(false)
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        location: '',
        notes: ''
    })
    const { vibrate } = usePreferences()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.date || !formData.time) {
            toast.error("Date et heure sont obligatoires")
            return
        }

        setSending(true)
        vibrate(10)

        const result = await sendMeetingRequest(conversationId, formData)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Demande de rendez-vous envoyée")
            vibrate(20)
            setOpen(false)
            setFormData({ date: '', time: '', location: '', notes: '' })
        }

        setSending(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-lg"
                >
                    <Calendar className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Proposer un rendez-vous</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Date <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Heure <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Lieu (optionnel)</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="Ex: Café du Centre, Bangui"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Notes (optionnel)</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Informations supplémentaires..."
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="flex-1"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={sending}
                            className="flex-1"
                        >
                            {sending ? 'Envoi...' : 'Envoyer'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
