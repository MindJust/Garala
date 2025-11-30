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

    )
)
