import { z } from "zod"

export const categorySchema = z.object({
  category: z.string().min(1, "Veuillez sélectionner une catégorie"),
})

export const detailsSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères").max(100),
  description: z.string().optional(),
  condition: z.enum(["new", "good", "fair", "poor"]).optional(),
})

export const priceSchema = z.object({
  price: z.coerce.number().min(0, "Le prix ne peut pas être négatif"),
  currency: z.string().default("XAF"),
})

export const locationSchema = z.object({
  quartier: z.string().min(2, "Veuillez sélectionner un quartier"),
  arrondissement: z.string().optional(),
  phone: z.string().refine(val => !val || /^\+?236\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/.test(val), {
    message: "Format: +236 XX XX XX XX"
  }).optional(),
})

export const imagesSchema = z.object({
  images: z.array(z.string().url()).min(1, "Veuillez ajouter au moins une photo").max(10, "Maximum 10 photos"),
})

// Combined schema for final submission
export const listingSchema = z.object({
  ...categorySchema.shape,
  ...detailsSchema.shape,
  ...priceSchema.shape,
  ...locationSchema.shape,
  ...imagesSchema.shape,
})

export type CategoryData = z.infer<typeof categorySchema>
export type DetailsData = z.infer<typeof detailsSchema>
export type PriceData = z.infer<typeof priceSchema>
export type LocationData = z.infer<typeof locationSchema>
export type ImagesData = z.infer<typeof imagesSchema>
export type ListingData = z.infer<typeof listingSchema>
