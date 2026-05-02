import { Button, Stack } from "@sanity/ui"
import { ArrowLeftIcon } from "@sanity/icons"
import { useCallback } from "react"
import { useDocumentPane } from "sanity/structure"

function BackButton({ path, parentLabel }) {
    let onPathOpen = null
    try {
        onPathOpen = useDocumentPane()?.onPathOpen
    } catch {}

    const handleBack = useCallback(() => {
        if (typeof onPathOpen !== "function") return
        try {
            onPathOpen(path.slice(0, -1))
        } catch {}
    }, [onPathOpen, path])

    if (typeof onPathOpen !== "function") return null

    return (
        <Button
            icon={ArrowLeftIcon}
            mode="bleed"
            text={`Back${parentLabel ? ` to ${parentLabel}` : ""}`}
            onClick={handleBack}
            padding={2}
            fontSize={1}
            style={{ alignSelf: "flex-start" }}
        />
    )
}

export function makeBackButtonItem(parentLabel) {
    return function BackButtonItem(props) {
        return props.renderDefault({
            ...props,
            children: (
                <Stack space={3}>
                    <BackButton path={props.path} parentLabel={parentLabel} />
                    {props.children}
                </Stack>
            ),
        })
    }
}
