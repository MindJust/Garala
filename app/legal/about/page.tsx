import { LEGAL_CONTENT } from "@/lib/legal-content"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
    const { about } = LEGAL_CONTENT

    return (
        <div className="container max-w-4xl py-8">
            <Link href="/">
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </Button>
            </Link>

            <div className="prose prose-slate max-w-none">
                <h1 className="text-3xl font-bold mb-2">{about.title}</h1>
                <p className="text-sm text-muted-foreground mb-8">
                    Dernière mise à jour : {about.lastUpdated}
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    {about.content}
                </p>

                {about.sections.map((section, index) => (
                    <div key={index} className="mb-6">
                        <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                        <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
