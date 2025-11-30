'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PreferencesStore {
    vibrationsEnabled: boolean
    toggleVibrations: () => void
    vibrate: (duration?: number) => void
}

export const usePreferences = create<PreferencesStore>()(
    persist(
        (set, get) => ({
            vibrationsEnabled: true,

            toggleVibrations: () => set((state) => ({
                vibrationsEnabled: !state.vibrationsEnabled
            })),

            vibrate: (duration = 10) => {
                const { vibrationsEnabled } = get()
                if (vibrationsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(duration)
                }
            }
        }),
        {
            name: 'garala-preferences'
        }
    )
)
