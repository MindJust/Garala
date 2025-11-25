'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ImageGallery({ images, title }: { images: string[], title: string }) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    const openGallery = (index: number) => {
        setSelectedIndex(index)
    }

    const closeGallery = () => {
        setSelectedIndex(null)
    }

    const goToPrevious = () => {
        if (selectedIndex === null) return
        setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)
    }

    const goToNext = () => {
        if (selectedIndex === null) return
        setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1)
    }

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') goToPrevious()
        if (e.key === 'ArrowRight') goToNext()
        if (e.key === 'Escape') closeGallery()
    }

    return (
        <>
            {/* Main Image */}
            <div
                className="aspect-video relative bg-muted rounded-xl overflow-hidden border cursor-pointer group"
                onClick={() => openGallery(0)}
            >
                {images[0] ? (
                    <>
                        <Image
                            src={images[0]}
                            alt={title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                            {images.length} photo{images.length > 1 ? 's' : ''}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        Pas d'image
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {images.slice(1, 5).map((img, i) => (
                        <div
                            key={i}
                            className="aspect-square relative bg-muted rounded-lg overflow-hidden border cursor-pointer group"
                            onClick={() => openGallery(i + 1)}
                        >
                            <Image src={img} alt={`${title} ${i + 2}`} fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                            {/* Show "+X" overlay on last thumbnail if more images */}
                            {i === 3 && images.length > 5 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="text-white font-bold text-2xl">+{images.length - 5}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Full Screen Gallery Modal */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onClick={closeGallery}
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeGallery}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-full text-sm z-10">
                            {selectedIndex + 1} / {images.length}
                        </div>

                        {/* Previous Button */}
                        {images.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    goToPrevious()
                                }}
                                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                            >
                                <ChevronLeft className="w-8 h-8 text-white" />
                            </button>
                        )}

                        {/* Current Image */}
                        <motion.div
                            key={selectedIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={images[selectedIndex]}
                                alt={`${title} ${selectedIndex + 1}`}
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>

                        {/* Next Button */}
                        {images.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    goToNext()
                                }}
                                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                            >
                                <ChevronRight className="w-8 h-8 text-white" />
                            </button>
                        )}

                        {/* Thumbnail Strip */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedIndex(i)
                                    }}
                                    className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === selectedIndex ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
