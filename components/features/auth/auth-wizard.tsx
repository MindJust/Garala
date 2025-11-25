'use client'

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { EmailStep } from "./steps/email-step"
import { PasswordStep } from "./steps/password-step"
import { ProfileStep } from "./steps/profile-step"
import { AuthState } from "./auth.schema"
import { signInWithEmail, signUpWithEmail, signInWithOAuth } from "./auth.actions"
import { toast } from "sonner"

export function AuthWizard() {
    const [state, setState] = useState<AuthState>({
        step: 1,
        email: "",
        password: "",
        fullName: "",
        username: "",
    })
    const [mode, setMode] = useState<'login' | 'signup'>('login')

    const nextStep = () => setState((prev) => ({ ...prev, step: prev.step + 1 }))
    const prevStep = () => setState((prev) => ({ ...prev, step: Math.max(1, prev.step - 1) }))

    const handleEmailSubmit = (email: string) => {
        setState((prev) => ({ ...prev, email }))
        nextStep()
    }

    const handlePasswordSubmit = async (password: string) => {
        setState((prev) => ({ ...prev, password }))

        if (mode === 'login') {
            // Try to sign in
            const res = await signInWithEmail(state.email, password)
            if (res?.error) {
                if (res.needsConfirmation) {
                    toast.error(res.error, { duration: 5000 })
                } else if (res.error.includes("Invalid")) {
                    toast.error("Email ou mot de passe incorrect")
                } else {
                    toast.error(res.error)
                }
            }
            // If successful, signInWithEmail redirects automatically
        } else {
            // Signup mode - proceed to profile
            nextStep()
        }
    }

    const handleProfileSubmit = async (data: { fullName: string, username: string }) => {
        const res = await signUpWithEmail(state.email, state.password, data)
        if (res?.error) {
            toast.error(res.error)
        } else if (res?.success) {
            toast.success(res.message, { duration: 5000 })
            // Reset to login mode and step 1
            setMode('login')
            setState({ step: 1, email: "", password: "", fullName: "", username: "" })
        }
    }

    const handleOAuth = async (provider: 'google' | 'apple') => {
        await signInWithOAuth(provider)
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-card rounded-xl shadow-lg border border-border">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold">Bienvenue sur Garala</h2>
                <p className="text-muted-foreground">
                    {mode === 'login' ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
                </p>
            </div>

            {/* Mode Toggle */}
            {state.step === 1 && (
                <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
                    <button
                        onClick={() => setMode('login')}
                        className={`flex-1 py-2 rounded-md font-medium transition-colors ${mode === 'login'
                                ? 'bg-background shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Connexion
                    </button>
                    <button
                        onClick={() => setMode('signup')}
                        className={`flex-1 py-2 rounded-md font-medium transition-colors ${mode === 'signup'
                                ? 'bg-background shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Inscription
                    </button>
                </div>
            )}

            <AnimatePresence mode="wait">
                {state.step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <EmailStep
                            onSubmit={handleEmailSubmit}
                            onOAuth={handleOAuth}
                            mode={mode}
                        />
                    </motion.div>
                )}

                {state.step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <PasswordStep
                            email={state.email}
                            onBack={prevStep}
                            onSubmit={handlePasswordSubmit}
                            mode={mode}
                        />
                    </motion.div>
                )}

                {state.step === 3 && mode === 'signup' && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <ProfileStep
                            onBack={prevStep}
                            onSubmit={handleProfileSubmit}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
