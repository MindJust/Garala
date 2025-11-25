import { AuthWizard } from "@/components/features/auth/auth-wizard"

export default function AuthPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <AuthWizard />
        </div>
    )
}
