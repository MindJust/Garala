// Quartiers et arrondissements de Bangui, République Centrafricaine
// Source: Données officielles - Bangui compte 10 arrondissements et 205 quartiers

export const BANGUI_LOCATIONS = [
    // Centre-Ville et quartiers centraux
    { arrondissement: "", quartier: "Centre-Ville" },

    // Quartiers du 1er arrondissement
    { arrondissement: "1er", quartier: "Ouango" },
    { arrondissement: "1er", quartier: "Pétèvo" },
    { arrondissement: "1er", quartier: "Ngaragba" },

    // Quartiers du 2ème arrondissement (25 quartiers)
    { arrondissement: "2ème", quartier: "Bacongo" },
    { arrondissement: "2ème", quartier: "Bakongo" },
    { arrondissement: "2ème", quartier: "Batambo" },
    { arrondissement: "2ème", quartier: "Bordeau 1" },
    { arrondissement: "2ème", quartier: "Bordeau 2" },
    { arrondissement: "2ème", quartier: "Bruxelles Gremboutou" },
    { arrondissement: "2ème", quartier: "Île des Singes" },
    { arrondissement: "2ème", quartier: "Île Bongo" },
    { arrondissement: "2ème", quartier: "Kangba" },
    { arrondissement: "2ème", quartier: "Kingoma" },
    { arrondissement: "2ème", quartier: "Lakouanga 1" },
    { arrondissement: "2ème", quartier: "Lakouanga 3" },
    { arrondissement: "2ème", quartier: "Lakouanga 4" },
    { arrondissement: "2ème", quartier: "Lakouanga 5" },
    { arrondissement: "2ème", quartier: "Lakouanga Sénégalais" },
    { arrondissement: "2ème", quartier: "Lakounga 0" },
    { arrondissement: "2ème", quartier: "Lakounga 6" },
    { arrondissement: "2ème", quartier: "Paris-Congo" },
    { arrondissement: "2ème", quartier: "Sapeke 2" },
    { arrondissement: "2ème", quartier: "Sica 2" },
    { arrondissement: "2ème", quartier: "Sica 3" },
    { arrondissement: "2ème", quartier: "Sica-Saïdou" },
    { arrondissement: "2ème", quartier: "Yapelle 1" },
    { arrondissement: "2ème", quartier: "Yapelle 2" },
    { arrondissement: "2ème", quartier: "Yapelle 3" },
    { arrondissement: "2ème", quartier: "Yapelle 4" },
    { arrondissement: "2ème", quartier: "Zebe" },

    // Quartiers du 3ème arrondissement
    { arrondissement: "3ème", quartier: "Combattants" },
    { arrondissement: "3ème", quartier: "Gbanikola" },
    { arrondissement: "3ème", quartier: "Miskine" },
    { arrondissement: "3ème", quartier: "Moscou" },
    { arrondissement: "3ème", quartier: "PK5" },
    { arrondissement: "3ème", quartier: "Kilomètre 5" },

    // Quartiers du 4ème arrondissement
    { arrondissement: "4ème", quartier: "Fatima" },
    { arrondissement: "4ème", quartier: "Catimi" },
    { arrondissement: "4ème", quartier: "Cattin" },

    // Quartiers du 5ème arrondissement (plus peuplé)
    { arrondissement: "5ème", quartier: "Bimbo" },
    { arrondissement: "5ème", quartier: "Bégoua" },
    { arrondissement: "5ème", quartier: "Kassaï" },
    { arrondissement: "5ème", quartier: "PK10" },
    { arrondissement: "5ème", quartier: "PK12" },
    { arrondissement: "5ème", quartier: "Sassara" },

    // Quartiers du 6ème arrondissement
    { arrondissement: "6ème", quartier: "Boy-Rabe" },
    { arrondissement: "6ème", quartier: "Fou" },
    { arrondissement: "6ème", quartier: "Gobongo" },

    // Quartiers du 7ème arrondissement
    { arrondissement: "7ème", quartier: "Sica 1" },
    { arrondissement: "7ème", quartier: "Rélais Sica" },
    { arrondissement: "7ème", quartier: "Ngociment" },

    // Quartiers du 8ème arrondissement
    { arrondissement: "8ème", quartier: "Ben-Zvi" },
    { arrondissement: "8ème", quartier: "Benz-vi" },
    { arrondissement: "8ème", quartier: "Cité Jean XXIII" },
    { arrondissement: "8ème", quartier: "36 Villas" },

    // Quartiers du 9ème arrondissement
    { arrondissement: "9ème", quartier: "Nzangognan" },
    { arrondissement: "9ème", quartier: "Ngongonon" },
    { arrondissement: "9ème", quartier: "Kpéténé" },

    // Quartiers du 10ème arrondissement
    { arrondissement: "10ème", quartier: "Mbossoro" },
    { arrondissement: "10ème", quartier: "Soua" },
    { arrondissement: "10ème", quartier: "Mamado" },
    { arrondissement: "10ème", quartier: "Umbaiki" },
    { arrondissement: "10ème", quartier: "Ramandji" },
    { arrondissement: "10ème", quartier: "Mustapha" },
    { arrondissement: "10ème", quartier: "Castors" },

    // Autres quartiers importants
    { arrondissement: "", quartier: "Lakouanga" },
    { arrondissement: "", quartier: "Colline" },
    { arrondissement: "", quartier: "Malimaka" },
    { arrondissement: "", quartier: "Edville" },
    { arrondissement: "", quartier: "Point Zéro" },
    { arrondissement: "", quartier: "Zongo" },
]

export const ARRONDISSEMENTS = ["1er", "2ème", "3ème", "4ème", "5ème", "6ème", "7ème", "8ème", "9ème", "10ème"]

export function getQuartiersByArrondissement(arr: string) {
    if (!arr) return BANGUI_LOCATIONS.filter(loc => !loc.arrondissement)
    return BANGUI_LOCATIONS.filter(loc => loc.arrondissement === arr)
}

export function searchQuartiers(query: string) {
    const lowerQuery = query.toLowerCase()
    return BANGUI_LOCATIONS.filter(loc =>
        loc.quartier.toLowerCase().includes(lowerQuery) ||
        (loc.arrondissement && loc.arrondissement.toLowerCase().includes(lowerQuery))
    )
}
