'use client'

import { useState } from 'react'
import { Share2, Edit, Trash2, Flag, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { deleteListing, reportListing } from './listing-management.actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ListingActionsProps {
    listingId: string
    listingTitle: string
    isOwner: boolean
    isGuest: boolean
}

export function ListingActions({ listingId, listingTitle, isOwner, isGuest }: ListingActionsProps) {
    const router = useRouter()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [reportDialogOpen, setReportDialogOpen] = useState(false)
    const [reportReason, setReportReason] = useState<string>('spam')
    const [reportDetails, setReportDetails] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const [isReporting, setIsReporting] = useState(false)

    const handleShare = async () => {
        const url = window.location.href

        // Try Web Share API first (mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: listingTitle,
                    url: url
                })
                toast.success('Partagé avec succès !')
            } catch (error) {
                // User cancelled share
                if ((error as Error).name !== 'AbortError') {
                    // Fallback to clipboard
                    await navigator.clipboard.writeText(url)
                    toast.success('Lien copié dans le presse-papier !')
                }
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(url)
                toast.success('Lien copié dans le presse-papier !')
            } catch (error) {
                toast.error('Impossible de copier le lien')
            }
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deleteListing(listingId)
            if (result?.error) {
                toast.error(result.error)
                setIsDeleting(false)
                setDeleteDialogOpen(false)
            }
            // If no error, redirect happens in server action (which throws NEXT_REDIRECT)
        } catch (error) {
            // Next.js redirect() throws a special error - ignore it
            if (error && typeof error === 'object' && 'digest' in error &&
                String((error as any).digest).includes('NEXT_REDIRECT')) {
                // This is expected - the redirect is happening
                return
            }
            // Real error
            toast.error('Erreur lors de la suppression')
            setIsDeleting(false)
            setDeleteDialogOpen(false)
        }
    }

    const handleReport = async () => {
        if (!reportReason) {
            toast.error('Veuillez sélectionner un motif')
            return
        }

        setIsReporting(true)
        try {
            const result = await reportListing(
                listingId,
                reportReason as any,
                reportDetails
            )

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(result.message || 'Signalement envoyé')
                setReportDialogOpen(false)
                setReportReason('spam')
                setReportDetails('')
            }
        } catch (error) {
            toast.error('Erreur lors du signalement')
        } finally {
            setIsReporting(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="w-5 h-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={handleShare}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Partager
                    </DropdownMenuItem>

                    {isOwner && !isGuest && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push(`/listings/${listingId}/edit`)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Modifier
                            </DropdownMenuItem>
                        </>
                    )}

                    {isOwner && (
                        <DropdownMenuItem
                            onClick={() => setDeleteDialogOpen(true)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                        </DropdownMenuItem>
                    )}

                    {!isOwner && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setReportDialogOpen(true)}
                                className="text-yellow-600 focus:text-yellow-600"
                            >
                                <Flag className="w-4 h-4 mr-2" />
                                Signaler
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer cette annonce ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Votre annonce sera définitivement supprimée.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {isDeleting ? 'Suppression...' : 'Supprimer'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Report Dialog */}
            <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Signaler cette annonce</DialogTitle>
                        <DialogDescription>
                            Aidez-nous à maintenir la qualité de Garala en signalant les annonces inappropriées.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-3">
                            <Label>Motif du signalement *</Label>
                            <RadioGroup value={reportReason} onValueChange={setReportReason}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="spam" id="spam" />
                                    <Label htmlFor="spam" className="font-normal cursor-pointer">
                                        Spam ou publicité excessive
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="inappropriate" id="inappropriate" />
                                    <Label htmlFor="inappropriate" className="font-normal cursor-pointer">
                                        Contenu inapproprié ou offensant
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="scam" id="scam" />
                                    <Label htmlFor="scam" className="font-normal cursor-pointer">
                                        Arnaque suspectée
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="duplicate" id="duplicate" />
                                    <Label htmlFor="duplicate" className="font-normal cursor-pointer">
                                        Annonce en double
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="other" id="other" />
                                    <Label htmlFor="other" className="font-normal cursor-pointer">
                                        Autre
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="details">Détails (optionnel)</Label>
                            <Textarea
                                id="details"
                                placeholder="Précisez les raisons de votre signalement..."
                                value={reportDetails}
                                onChange={(e) => setReportDetails(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setReportDialogOpen(false)}
                            disabled={isReporting}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleReport}
                            disabled={isReporting}
                        >
                            {isReporting ? 'Envoi...' : 'Envoyer le signalement'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
