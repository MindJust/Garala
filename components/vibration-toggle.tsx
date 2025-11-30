'use client'

import { usePreferences } from "@/hooks/use-preferences"
import { Vibrate } from "lucide-react"

export function VibrationToggle() {
    const { vibrationsEnabled, toggleVibrations, vibrate } = usePreferences()

    const handleToggle = () => {
        toggleVibrations()
        // Vibrate when turning ON to demonstrate
        if (!vibrationsEnabled && navigator.vibrate) {
            navigator.vibrate(20)
        }
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Vibrate className="w-5 h-5 text-muted-foreground" />
                <div>
                    <p className="font-medium">Vibrations</p>
                    <p className="text-sm text-muted-foreground">
                        Retour haptique lors des interactions
                    </p>
                </div>
            </div>

            <button
                onClick={handleToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${vibrationsEnabled ? 'bg-primary' : 'bg-muted'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${vibrationsEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    )
}
