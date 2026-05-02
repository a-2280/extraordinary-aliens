import { useCallback, useMemo, useRef } from "react"
import { set, setIfMissing, unset, useFormValue } from "sanity"
import { Stack, Text } from "@sanity/ui"
import { urlFor } from "../lib/image"

export default function SpotPointInput(props) {
    const { value, onChange, path, readOnly } = props
    const imgRef = useRef(null)

    const parentImagePath = useMemo(() => {
        const parent = path.slice(0, -3)
        return [...parent, "image"]
    }, [path])

    const image = useFormValue(parentImagePath)

    const imageUrl = useMemo(() => {
        if (!image?.asset?._ref) return null
        try {
            return urlFor(image).width(1200).fit("max").url()
        } catch {
            return null
        }
    }, [image])

    const handleClick = useCallback((e) => {
        if (readOnly) return
        const rect = imgRef.current?.getBoundingClientRect()
        if (!rect || rect.width === 0 || rect.height === 0) return
        const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
        const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height))
        onChange([
            setIfMissing({}),
            set(x, ["x"]),
            set(y, ["y"]),
        ])
    }, [onChange, readOnly])

    const handleClear = useCallback(() => {
        if (readOnly) return
        onChange(unset())
    }, [onChange, readOnly])

    if (!imageUrl) {
        return (
            <Stack space={3} padding={3}>
                <Text size={1} muted>
                    Add an image to the parent Hotspot Image first, then return here to drop a point.
                </Text>
            </Stack>
        )
    }

    const x = typeof value?.x === "number" ? value.x : null
    const y = typeof value?.y === "number" ? value.y : null
    const hasPoint = x !== null && y !== null

    return (
        <Stack space={3}>
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    cursor: readOnly ? "default" : "crosshair",
                    userSelect: "none",
                    borderRadius: 6,
                    overflow: "hidden",
                    border: "1px solid var(--card-border-color, #2a2a2a)",
                }}
                onClick={handleClick}
            >
                <img
                    ref={imgRef}
                    src={imageUrl}
                    alt=""
                    draggable={false}
                    style={{ display: "block", width: "100%", height: "auto" }}
                />
                {hasPoint && (
                    <div
                        style={{
                            position: "absolute",
                            left: `${x * 100}%`,
                            top: `${y * 100}%`,
                            width: 10,
                            height: 10,
                            transform: "translate(-50%, -50%)",
                            background: "#0f0f0f",
                            border: "1px solid #dadada",
                            borderRadius: "50%",
                            boxShadow: "0 0 0 1px rgba(0,0,0,0.2)",
                            pointerEvents: "none",
                        }}
                    />
                )}
            </div>
            <Text size={1} muted>
                {hasPoint
                    ? `Point: ${(x * 100).toFixed(1)}%, ${(y * 100).toFixed(1)}% — click the image to move it${readOnly ? "" : ", or "}`
                    : "Click anywhere on the image to place this spot."}
                {hasPoint && !readOnly && (
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); handleClear() }}
                        style={{ marginLeft: 4 }}
                    >
                        clear
                    </a>
                )}
            </Text>
        </Stack>
    )
}
