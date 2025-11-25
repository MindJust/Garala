// Category translations and utilities

export const CATEGORIES = [
    { id: "vehicles", label: "Véhicules" },
    { id: "real_estate", label: "Immobilier" },
    { id: "electronics", label: "Électronique" },
    { id: "fashion", label: "Mode" },
    { id: "home", label: "Maison" },
    { id: "hobbies", label: "Loisirs" },
    { id: "multimedia", label: "Multimédia" },
    { id: "games", label: "Jeux & Jouets" },
] as const

export type CategoryId = typeof CATEGORIES[number]['id']

export function getCategoryLabel(id: string): string {
    const category = CATEGORIES.find(cat => cat.id === id)
    return category?.label || id
}
