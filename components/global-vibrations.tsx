'use client'

import { useEffect } from 'react'
import { usePreferences } from '@/hooks/use-preferences'

export function GlobalVibrations() {
    const { vibrate, vibrationsEnabled } = usePreferences()

    useEffect(() => {
        if (!vibrationsEnabled) return

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement

            // Check if clicked element is interactive
            const isInteractive = target.closest('button, a, [role="button"], [role="link"], input[type="submit"], input[type="button"]')

            if (isInteractive) {
                vibrate(10)
            }
        }

        // Only add listener on touch devices
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

        if (isTouchDevice) {
            document.addEventListener('click', handleClick, { passive: true })
        }

        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [vibrationsEnabled, vibrate])

    return null
}
