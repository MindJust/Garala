import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t bg-card/50 backdrop-blur-sm mt-auto">
            <div className="container py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-semibold mb-4">Garala</h3>
                        <p className="text-sm text-muted-foreground">
                            Tout se vend, tout s'achète
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4 text-sm">Légal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/legal/terms" className="hover:text-foreground transition-colors">
                                    CGU
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/privacy" className="hover:text-foreground transition-colors">
                                    Confidentialité
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/cookies" className="hover:text-foreground transition-colors">
                                    Cookies
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/about" className="hover:text-foreground transition-colors">
                                    À propos
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4 text-sm">Support</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/help" className="hover:text-foreground transition-colors">
                                    Centre d'aide
                                </Link>
                            </li>
                            <li>
                                <Link href="/help/faq" className="hover:text-foreground transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-foreground transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4 text-sm">Suivez-nous</h4>
                        <p className="text-sm text-muted-foreground">
                            Restez connecté pour les dernières nouvelles
                        </p>
                    </div>
                </div>

                <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Garala. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    )
}
