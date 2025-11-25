'use client'

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CategoryStep } from "./steps/category-step"
import { DetailsStep } from "./steps/details-step"
import { PriceStep } from "./steps/price-step"
import { LocationStep } from "./steps/location-step"
import { ImagesStep } from "./steps/images-step"
import { ListingData } from "./listings.schema"
import { createListing } from "./listings.actions"
import { toast } from "sonner"

export function ListingWizard() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<Partial<ListingData>>({})

    const nextStep = () => setStep((prev) => prev + 1)
    const prevStep = () => setStep((prev) => prev - 1)

    const updateData = (data: Partial<ListingData>) => {
        setFormData((prev) => ({ ...prev, ...data }))
        nextStep()
    }

    const handleSubmit = async (imagesData: { images: string[] }) => {
        const finalData = { ...formData, ...imagesData } as ListingData
        const res = await createListing(finalData)

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Annonce publiée avec succès !")
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-card rounded-xl shadow-lg border border-border">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Déposer une annonce</h2>
                    <span className="text-sm text-muted-foreground">Étape {step} sur 5</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${(step / 5) * 100}%` }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <CategoryStep
                            defaultValues={formData}
                            onSubmit={updateData}
                        />
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <DetailsStep
                            defaultValues={formData}
                            onBack={prevStep}
                            onSubmit={updateData}
                        />
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <PriceStep
                            defaultValues={formData}
                            onBack={prevStep}
                            onSubmit={updateData}
                        />
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <LocationStep
                            defaultValues={formData}
                            onBack={prevStep}
                            onSubmit={updateData}
                        />
                    </motion.div>
                )}

                {step === 5 && (
                    <motion.div
                        key="step5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <ImagesStep
                            defaultValues={formData}
                            onBack={prevStep}
                            onSubmit={handleSubmit}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
