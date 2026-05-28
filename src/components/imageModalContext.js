"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"

const ImageModalContext = createContext(null)

function pushChild(result, child) {
    if (!child) return
    switch (child._type) {
        case "imageCard": {
            if (!child.image || child.video) return
            result.push({ _key: child._key, image: child.image, caption: child.description })
            return
        }
        case "carousel": {
            for (const slide of child.slides || []) {
                if (!slide?.image || !slide._key) continue
                result.push({ _key: slide._key, image: slide.image, video: slide.video })
            }
            return
        }
        case "captionCarousel": {
            for (const slide of child.slides || []) {
                if (!slide?.image || !slide._key) continue
                result.push({ _key: slide._key, image: slide.image, video: slide.video, caption: slide.caption })
            }
            return
        }
        case "annotationImage":
        case "imageHotspot": {
            if (!child.image || child.video) return
            result.push({ _key: child._key, image: child.image })
            return
        }
        case "imageExpandableCaption":
        case "imageCaptionHover": {
            if (!child.image || child.video) return
            result.push({ _key: child._key, image: child.image, caption: child.caption })
            return
        }
        case "imageTrio": {
            for (const item of child.items || []) {
                if (!item?.image || !item._key || item.video) continue
                result.push({ _key: item._key, image: item.image })
            }
            return
        }
    }
}

function collectImages(sections) {
    const result = []
    const visitSection = entry => {
        if (entry?._type !== "section") return
        for (const child of entry.left || []) pushChild(result, child)
        for (const child of entry.right || []) pushChild(result, child)
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
    const images = useMemo(() => collectImages(sections), [sections])
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
