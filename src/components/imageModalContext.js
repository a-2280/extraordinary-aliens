"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"

const ImageModalContext = createContext(null)

function collectImageCards(sections) {
    const result = []
    const visitSection = entry => {
        if (entry?._type !== "section") return
        for (const child of [entry.left?.[0], entry.right?.[0]]) {
            if (child?._type === "imageCard" && child.image) result.push(child)
        }
    }
    for (const entry of sections || []) {
        if (entry?._type === "sectionGroup") {
            for (const item of entry.items || []) visitSection(item)
        } else {
            visitSection(entry)
        }
    }
    return result
}

export function ImageModalProvider({ sections, children }) {
    const images = useMemo(() => collectImageCards(sections), [sections])
    const [openKey, setOpenKey] = useState(null)

    const currentIndex = openKey
        ? images.findIndex(i => i._key === openKey)
        : -1

    const open = useCallback(key => setOpenKey(key), [])
    const close = useCallback(() => setOpenKey(null), [])
    const next = useCallback(() => {
        setOpenKey(key => {
            const i = images.findIndex(img => img._key === key)
            if (i < 0 || i >= images.length - 1) return key
            return images[i + 1]._key
        })
    }, [images])
    const prev = useCallback(() => {
        setOpenKey(key => {
            const i = images.findIndex(img => img._key === key)
            if (i <= 0) return key
            return images[i - 1]._key
        })
    }, [images])

    const value = useMemo(
        () => ({ images, currentIndex, isOpen: currentIndex >= 0, open, close, next, prev }),
        [images, currentIndex, open, close, next, prev],
    )

    return (
        <ImageModalContext.Provider value={value}>
            {children}
        </ImageModalContext.Provider>
    )
}

export function useImageModal() {
    return useContext(ImageModalContext)
}
