'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Cookie } from "lucide-react"
import Link from "next/link"

export function CookieConsent() {
    const [show, setShow] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent')
        if (!consent) {
            // Show after 2 seconds
            const timer = setTimeout(() => setShow(true), 2000)
            return () => clearTimeout(timer)
        }
    }, [])

    const accept = () => {
        localStorage.setItem('cookie-consent', 'accepted')
        setShow(false)
    }

    const decline = () => {
        localStorage.setItem('cookie-consent', 'declined')
        setShow(false)
    }

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
                >
                    <div className="container max-w-4xl">
                        <div className="bg-card/95 backdrop-blur-lg border rounded-2xl shadow-2xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <Cookie className="w-6 h-6 text-primary" />
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-2">
                                        Nous utilisons des cookies
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Nous utilisons des cookies essentiels pour faire fonctionner notre site et améliorer votre expérience.
                                        En continuant, vous acceptez notre utilisation des cookies.{' '}
                                        <Link href="/legal/cookies" className="text-primary hover:underline">
                                            En savoir plus
                                        </Link>
                                    </p>

                                    <div className="flex flex-wrap gap-3">
                                        <Button onClick={accept} size="sm">
                                            Accepter
                                        </Button>
                                        <Button onClick={decline} variant="outline" size="sm">
                                            Refuser
                                        </Button>
                                    </div>
                                </div>

                                <button
                                    onClick={decline}
                                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                                    aria-label="Fermer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
