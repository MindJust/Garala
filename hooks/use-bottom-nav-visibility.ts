'use client'

import { useState, useEffect } from 'react'

export function useBottomNavVisibility() {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const handleFocus = (e: FocusEvent) => {
            const target = e.target as HTMLElement
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                setIsVisible(false)
            }
        }

        const handleBlur = () => {
            setIsVisible(true)
        }

        // Modern browsers support 'focusin' and 'focusout' which bubble
        document.addEventListener('focusin', handleFocus)
        document.addEventListener('focusout', handleBlur)

        return () => {
            document.removeEventListener('focusin', handleFocus)
            document.removeEventListener('focusout', handleBlur)
        }
    }, [])

    return isVisible
}
