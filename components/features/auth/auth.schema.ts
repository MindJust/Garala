import { z } from "zod"

export const emailSchema = z.object({
    email: z.string().email("Email invalide"),
})

export const passwordSchema = z.object({
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
})

export const profileSchema = z.object({
    fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
})

export type EmailData = z.infer<typeof emailSchema>
export type PasswordData = z.infer<typeof passwordSchema>
export type ProfileData = z.infer<typeof profileSchema>

export type AuthState = {
    step: number
    email: string
    password: string
    fullName: string
    username: string
}
