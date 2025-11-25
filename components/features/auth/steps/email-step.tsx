'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { emailSchema, EmailData } from "../auth.schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function EmailStep({
    onSubmit,
    onOAuth,
    mode
}: {
    onSubmit: (email: string) => void,
    onOAuth: (provider: 'google' | 'apple') => void,
    mode: 'login' | 'signup'
}) {
    const { register, handleSubmit, formState: { errors } } = useForm<EmailData>({
        resolver: zodResolver(emailSchema),
    })

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Button
                    variant="outline"
                    className="w-full flex gap-2"
                    onClick={() => onOAuth('google')}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continuer avec Google
                </Button>
                <Button
                    variant="outline"
                    className="w-full flex gap-2"
                    onClick={() => onOAuth('apple')}
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.64 3.98-1.54 2.1.12 3.53 1.09 4.36 2.26-3.57 1.83-3.01 6.59.52 8.22-.66 1.73-1.55 3.53-3.94 3.29zm-2.97-17.52c.98-.91 2.1-1.53 3.08-1.56.1.84-.54 2.03-1.29 2.92-.74.89-2.06 1.55-2.98 1.49-.1-.84.49-1.97 1.19-2.85z" />
                    </svg>
                    Continuer avec Apple
                </Button>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Ou avec email</span>
                </div>
            </div>

            <form onSubmit={handleSubmit((data) => onSubmit(data.email))} className="space-y-4">
                <div className="space-y-2">
                    <Input
                        {...register("email")}
                        placeholder="nom@exemple.com"
                        type="email"
                        autoComplete="email"
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <Button type="submit" className="w-full">Continuer</Button>
            </form>
        </div>
    )
}
